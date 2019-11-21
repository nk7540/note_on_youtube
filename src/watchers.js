const initWatchers = () => {
  watchInputFocus();
  // watchInputBlur();
  watchClickAddNote();
  watchClickEditNote();
  watchClickEditInput();
  watchClickDeleteNote();
  watchClickTimestamp();
  watchKeyModifyTimestamp();
  watchClickIncreaseTimestamp();
  watchClickDecreaseTimestamp();
  watchKeySkipVideo();
};

const SPARE_SECOND = 3;
const SKIP_SECOND = 3;
var noteTimestamp;

const watchInputFocus = () => {
  $('#note-input').on('focus', function(e){
    const video = $('video').get(0);
    if (!$('#current-time-box').text()) {
      video.pause();
      noteTimestamp = decreaseByOrZero(Math.floor(video.currentTime), SPARE_SECOND);
      updateTimeBox();
    };
  });
};

// const watchInputBlur = () => {
//   $('#note-input').on('blur', function(e){
//     const video = $('video').get(0);
//     noteTimestamp = '';
//     video.play();
//     updateTimeBox();
//   });
// };

const watchClickAddNote = () => {
  $('#add-note').on('click', function(e){
  const video = $('video').get(0);
  const input = $('#note-input');
  const currentVideoId = getCurrentVideoId();
  const currentTimeBox = $('#current-time-box');
    const value = input.val();
    chrome.storage.sync.get(function(items) {
      items.latestId++;
      if (!(currentVideoId in items)) items[currentVideoId] = {};
      const currentVideoNotes = items[currentVideoId];
      currentVideoNotes[items.latestId] = { timestamp: noteTimestamp, value: value };
      const sortedIds = getSortedIds(currentVideoNotes);
      const indexOfTheId = sortedIds.indexOf(items.latestId.toString());

      chrome.storage.sync.set(items);
      appendNote(items.latestId, indexOfTheId, noteTimestamp, value);
    });
    input.val('');
    currentTimeBox.text('');
    video.play();
  });
};

const watchClickEditNote = () => {
  $(document).on('click', '.edit-note', function(e){
    const currentVideoId = getCurrentVideoId();
    const value = $(this).parent('div.input-group-append').prev('textarea').val();
    const id = $(this).parents('tr').attr('id');
    chrome.storage.sync.get(function(items) {
      items[currentVideoId][id]['value'] = value;

      chrome.storage.sync.set(items);
      updateNote(id, value);
    });
  });
};

const watchClickEditInput = () => {
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
};

const watchClickDeleteNote = () => {
  $(document).on('click', '.fa-trash-alt', function(e) {
    const currentVideoId = getCurrentVideoId();
    const tr = $(this).parents('tr');
    if (confirm('このメモを削除してもよろしいですか？')) {
      chrome.storage.sync.get(function(items){
        delete items[currentVideoId][tr.attr('id')];
        chrome.storage.sync.set(items);
      });
      tr.remove();
    };
  });
};

const watchClickTimestamp = () => {
  $(document).on('click', '.timestamps', function(e){
    const video = $('video').get(0);
    e.preventDefault();
    const time = event.target.href.match(/t=\d+/g);
    video.currentTime = time[0].substring(2);
    if (video.paused) {
      video.play();
    };
  });
};

const watchKeyModifyTimestamp = () => {
  $(document).on('keyup', '.modify-timestamp', function(e){
    if (e.keyCode === 78) {
      noteTimestamp++; // Press n
    } else if (e.keyCode === 80) {
      noteTimestamp = decreaseByOrZero(noteTimestamp, 1); // Press p
    };
    updateTimeBox();
  });
};

const watchClickIncreaseTimestamp = () => {
  $(document).on('click', '#increase-timestamp', function(e){
    noteTimestamp++;
    updateTimeBox();
  });
};

const watchClickDecreaseTimestamp = () => {
  $(document).on('click', '#decrease-timestamp', function(e){
    noteTimestamp = decreaseByOrZero(noteTimestamp, 1);
    updateTimeBox();
  });
};

const watchKeySkipVideo = () => {
  $(document).on('keyup', function(e){
    const video = $('video').get(0);
    const currentTime = video.currentTime;
    if (e.keyCode === 69) {
      video.currentTime = currentTime + SKIP_SECOND; // Press e
    } else if (e.keyCode === 89) {
      video.currentTime = decreaseByOrZero(currentTime, SKIP_SECOND); // Press y
    };
  });
};
