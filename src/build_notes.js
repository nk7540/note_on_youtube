const buildInput = () => {
  $('#secondary').prepend(`
    <div class="input-group">
      <div class="input-group-prepend" style="display: block;">
        <button id="decrease-timestamp" class="btn btn-outline-secondary modify-timestamp" type="button">
          <i class="fas fa-caret-up"></i>
        </button>
        <span class="input-group-text" id="current-time-box"></span>
        <button id="increase-timestamp" class="btn btn-outline-secondary modify-timestamp" type="button">
          <i class="fas fa-caret-down"></i>
        </button>
      </div>
      <textarea id="note-input" type="text" class="form-control" placeholder="メモを追加" rows="4"></textarea>
      <div class="input-group-append">
        <button id="add-note" class="btn btn-outline-secondary" type="button">追加</button>
      </div>
    </div>
  `);
}
const buildNotes = () => {
  $('#secondary').prepend(`
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
  `);

  const currentVideoId = getCurrentVideoId();
  chrome.storage.sync.get([currentVideoId], function(result) {
    const currentVideoNotes = result[currentVideoId];
    if (!currentVideoNotes) return false;
    const sortedIds = getSortedIds(currentVideoNotes);
    $.each(sortedIds, function(index, id) {
      appendNote(id, index, ...Object.values(currentVideoNotes[id]));
    });
  });
};

const appendNote = (id, indexOfTheId, timestamp, val) => {
  const currentVideoId = getCurrentVideoId();
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

const updateNote = (id, value) => {
  const tr = $(`tr#${id}`);
  tr.find('div.input-group').remove();
  tr.children('td.note-value').text(value);
};
