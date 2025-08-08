document.getElementById("donate").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://www.buymeacoffee.com/yourname" });
});

chrome.storage.sync.get({ lookups: [] }, (data) => {
  const list = document.getElementById("lookup-list");
  data.lookups.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.text} → ${item.meaning}`;
    list.appendChild(li);
  });
});
