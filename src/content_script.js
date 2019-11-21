//----------------------
$(function () {
  let readyStateCheckInterval = setInterval(() => {
    if (document.readyState === "complete") {
      if ($('#secondary').length && getCurrentVideoId()) {
        initNotes();
      }

      function initNotes() {
        let latestVideoId = getCurrentVideoId();
        clearInterval(readyStateCheckInterval);
        buildInput();
        buildNotes();
        initWatchers();
        watchVideoForChanges(latestVideoId);

        function watchVideoForChanges(latestVideoId) {
          setInterval(() => {
            if (getCurrentVideoId() && latestVideoId !== getCurrentVideoId()) {
              $("#notes").remove();

              buildNotes();
              latestVideoId = getCurrentVideoId();
            }
          }, 1000);
        }
      }
    }
  }, 1000);



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


  $(document).keyup(function (e) {
    const video = $('video').get(0);
    if (e.keyCode === 27) {
      $('#note-input').blur();
      noteTimestamp = '';
      updateTimeBox();
      video.play();
    };
  });

  Mousetrap.bind('command+i', () => {
    $('#note-input').focus();
  });
});
