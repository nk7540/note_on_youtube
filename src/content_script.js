//----------------------
$(function () {
    $('#related').prepend(`
        <div id="notes" class="container">
            <div class="table-responsive">
                <table class="table table-striped table-fixed" style="width: 100%;">
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
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="current-time"></span>
            </div>
            <input id="note-input" type="text" class="form-control" placeholder="メモを追加" aria-label="Username" aria-describedby="basic-addon1">
            <div class="input-group-append">
                <button id="add-note" class="btn btn-outline-secondary" type="button">追加</button>
            </div>
        </div>
    `);

    const video = $('video').get(0);
    const input = $('#note-input');
    var currentTime;

    input.on('focus', function(e){
        video.pause();
        currentTime = Math.floor(video.currentTime);
        $('#current-time').text(`${Math.floor(currentTime / 60)}:${currentTime % 60}`)
    });

    $('#add-note').on('click', function(e){
        $('#notes-tbody').append(`
            <tr class="d-flex">
                <th class="col-3" scope="row">
                    <a class="timestamps yt-simple-endpoint" href="/watch?v=${getParameterByName('v')}&t=${currentTime}s">
                        ${Math.floor(currentTime / 60)}:${currentTime % 60}
                    </a>
                </th>
                <td class="col-9">${input.val()}</td>
            </tr>
        `);
        input.val('');
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
});
