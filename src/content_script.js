//----------------------
$(function () {
    $('#related').prepend(`
        <div id="notes" class="container">
            <div class="table-responsive">
                <table class="table table-striped table-fixed" style="table-layout: fixed;">
                    <thead>
                        <tr class="d-flex">
                            <th class="col-3">再生時間</th>
                            <th class="col-9">メモ</th>
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
    var currentTime;

    input.on('focus', function(e){
        video.pause();
        currentTime = Math.floor(video.currentTime);
        currentTimeBox.text(formatTime(currentTime))
    });

    $('#add-note').on('click', function(e){
        $('#notes-tbody').append(`
            <tr class="d-flex">
                <th class="col-3" scope="row">
                    <a class="timestamps yt-simple-endpoint" href="/watch?v=${getParameterByName('v')}&t=${currentTime}s">
                        ${formatTime(currentTime)}
                    </a>
                </th>
                <td class="col-9" style="white-space: pre-wrap; word-wrap: break-word;">${input.val()}</td>
            </tr>
        `);
        input.val('');
        currentTimeBox.text('');
        video.play();
    });

    $(document).on('click', '.timestamps', function(e){
        e.preventDefault();
        const time = event.target.href.match(/t=\d+/g);
        video.currentTime = time[0].substring(2);
        if (video.paused) {
            video.play();
        };
    });

console.log(formatTime(3500));
});
