//----------------------
$(function () {
    $('#related').prepend(`
        <div id="notes" class="container">
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>再生時間</th>
                            <th>メモ</th>
                        </tr>
                    </thead>
                    <tbody id="notes-tbody"></tbody>
                </table>
            </div>
        </div>
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">再生時間</span>
            </div>
            <input id="note-input" type="text" class="form-control" placeholder="メモを追加" aria-label="Username" aria-describedby="basic-addon1">
            <div class="input-group-append">
                <button id="add-note" class="btn btn-outline-secondary" type="button">追加</button>
            </div>
        </div>
    `);

    const input = $('#note-input');

    $('#add-note').on('click', function(e){
        $('#notes-tbody').append(`
            <tr>
                <th scope="row">再生時間</th>
                <td>${input.val()}</td>
            </tr>
        `);
        input.val('');
    });
});
