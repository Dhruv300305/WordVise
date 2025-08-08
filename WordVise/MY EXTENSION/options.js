chrome.storage.sync.get({ highlight: true, saveLookups: true }, (data) => {
  document.getElementById("highlight").checked = data.highlight;
  document.getElementById("saveLookups").checked = data.saveLookups;
});

document.getElementById("highlight").addEventListener("change", (e) => {
  chrome.storage.sync.set({ highlight: e.target.checked });
});

document.getElementById("saveLookups").addEventListener("change", (e) => {
  chrome.storage.sync.set({ saveLookups: e.target.checked });
});
