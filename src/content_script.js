//----------------------
$(function () {
    $('#related').prepend(`
        <div id="notes" class="container">
            <div class="table-responsive">
                <table class="table table-striped table-fixed" style="table-layout: fixed;">
                    <thead>
                        <tr class="d-flex">
                            <th class="col-2">再生時間</th>
                            <th class="col-8">メモ</th>
                        </tr>
                    </thead>
                    <tbody id="notes-tbody"></tbody>
                </table>
            </div>
        </div>
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text" id="current-time-box"></span>
            </div>
            <textarea id="note-input" type="text" class="form-control" placeholder="メモを追加" rows="4"></textarea>
            <div class="input-group-append">
                <button id="add-note" class="btn btn-outline-secondary" type="button">追加</button>
            </div>
        </div>
    `);

    const video = $('video').get(0);
    const input = $('#note-input');
    const currentTimeBox = $('#current-time-box');
    const currentVideoId = getParameterByName('v');
    var currentTime;

    chrome.storage.sync.get([currentVideoId], function(result) {
        const notes = result[currentVideoId];
        if (!notes) return false;
        $.each(notes, function(id, note) {
            appendNote(id, ...Object.values(note));
        });
    });

    input.on('focus', function(e){
        video.pause();
        currentTime = Math.floor(video.currentTime);
        currentTimeBox.text(formatTime(currentTime))
    });

    $('#add-note').on('click', function(e){ 
        const value = input.val();
        chrome.storage.sync.get(function(items) {
            if (!(currentVideoId in items)) items[currentVideoId] = {};
            items[currentVideoId][items.latestId + 1] = { timestamp: currentTime, value: value };
            items.latestId++;
            
            chrome.storage.sync.set(items);
            appendNote(items.latestId, currentTime, value);
        });
        input.val('');
        currentTimeBox.text('');
        video.play();
    });

    $(document).on('click', '.edit-note', function(e){
        const value = $(this).parent('div.input-group-append').prev('textarea').val();
        const id = $(this).parents('tr').attr('id');
        chrome.storage.sync.get(function(items) {
            items[currentVideoId][id]['value'] = value;

            chrome.storage.sync.set(items);
            updateNote(id, value);
        });
    });

    $(document).on('click', '.fa-edit', function(e) {
        const td = $(this).parent('td.edit-note-button').prev('td.note-value');
        const value = td.text();
        td.text('');
        td.append(`
            <div class="input-group mb-3">
                <textarea id="note-edit-input" type="text" class="form-control" placeholder="メモを編集" rows="4">${value}</textarea>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary edit-note" type="button">編集</button>
                </div>
            </div>
        `);
    });

    $(document).on('click', '.fa-trash-alt', function(e) {
        const tr = $(this).parents('tr');
        if (confirm('このメモを削除してもよろしいですか？')) {
            chrome.storage.sync.get(function(items){
                delete items[currentVideoId][tr.attr('id')];
                chrome.storage.sync.set(items);
            });
            tr.remove();
        };
    });

    $(document).on('click', '.timestamps', function(e){
        e.preventDefault();
        const time = event.target.href.match(/t=\d+/g);
        video.currentTime = time[0].substring(2);
        if (video.paused) {
            video.play();
        };
    });

    function appendNote(id, timestamp, val) {
        $('#notes-tbody').append(`
            <tr id="${id}" class="d-flex">
                <th class="col-2" scope="row">
                    <a class="timestamps yt-simple-endpoint" href="/watch?v=${currentVideoId}&t=${timestamp}s">
                        ${formatTime(timestamp)}
                    </a>
                </th>
                <td class="col-8 note-value">${val}</td>
                <td class="col-1 edit-note-button"><i class="far fa-edit"></i></td>
                <td class="col-1 destroy-note-button"><i class="far fa-trash-alt"></i></td>
            </tr>
        `);
    };

    function updateNote(id, value) {
        const tr = $(`tr#${id}`);
        tr.find('div.input-group').remove();
        tr.children('td.note-value').text(value);
    };
});
