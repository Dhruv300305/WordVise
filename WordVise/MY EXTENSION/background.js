let settings = {
  highlight: true,
  saveLookups: true
};

// Load settings
chrome.storage.sync.get(settings, (data) => {
  settings = data;
});

chrome.storage.onChanged.addListener((changes) => {
  for (let key in changes) {
    settings[key] = changes[key].newValue;
  }
});

// Create context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lookup",
    title: "Explain with WordWise AI",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "lookup" && info.selectionText) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text, settings) => {
        document.dispatchEvent(new CustomEvent("wordwise_lookup", { detail: { text, settings } }));
      },
      args: [info.selectionText, settings]
    });
  }
});
