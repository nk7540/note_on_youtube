chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ latestId: 0 });
});
