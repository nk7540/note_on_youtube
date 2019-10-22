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
        const currentVideoNotes = result[currentVideoId];
        if (!currentVideoNotes) return false;
        const sortedIds = getSortedIds(currentVideoNotes);
        $.each(sortedIds, function(index, id) {
            appendNote(id, index, ...Object.values(currentVideoNotes[id]));
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
            items.latestId++;
            if (!(currentVideoId in items)) items[currentVideoId] = {};
            const currentVideoNotes = items[currentVideoId];
            currentVideoNotes[items.latestId] = { timestamp: currentTime, value: value };
            const sortedIds = getSortedIds(currentVideoNotes);
            const indexOfTheId = sortedIds.indexOf(items.latestId.toString());

            chrome.storage.sync.set(items);
            appendNote(items.latestId, indexOfTheId, currentTime, value);
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

    // @TODO 要素内スクロールにしたい・手動でもスクロールできるようにしたい
    // setInterval(() => {
    //     chrome.storage.sync.get(function(items){
    //         let diff = [];
    //         let index = 0;
    //         const currentVideoNotes = items[currentVideoId];
    //         if (!currentVideoNotes) return false;
    //         const timestamps = $.map(currentVideoNotes, function(note, index) {
    //             return note.timestamp;
    //         });
    //         if (!timestamps) return false;
    //         $.each(timestamps, function(i, timestamp) {
    //             diff[i] = Math.abs(video.currentTime - timestamp);
    //             index = (diff[index] < diff[i]) ? index : i;
    //         });
    //         $('#notes-tbody').children('tr').eq(index).get(0).scrollIntoView({ behavior: 'smooth', block: 'center' });
    //     });
    // }, 1000);

    function appendNote(id, indexOfTheId, timestamp, val) {
        if (indexOfTheId == 0) {
            $('#notes-tbody').prepend(`
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
        } else {
            $('#notes-tbody').children('tr').eq(indexOfTheId - 1).after(`
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
    };

    function updateNote(id, value) {
        const tr = $(`tr#${id}`);
        tr.find('div.input-group').remove();
        tr.children('td.note-value').text(value);
    };

    function getSortedIds(notes) {
        return Object.keys(notes).sort((a, b) => {
            return notes[a].timestamp - notes[b].timestamp;
        });
    }

    input.keyup(function (e) {
        if (e.keyCode === 27) {
            $(this).blur();
            video.play();
        };
    });

    Mousetrap.bind('command+i', () => {
        input.focus();
    });
});
