chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.clear();
  chrome.storage.sync.set({ latestId: 0 });
});

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   if (changeInfo.status === 'complete') chrome.runtime.reload();
// });
