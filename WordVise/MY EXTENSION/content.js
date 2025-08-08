document.addEventListener("wordwise_lookup", async (e) => {
  const { text, settings } = e.detail;

  if (settings.highlight) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.backgroundColor = "#fffa91";
      span.style.borderRadius = "3px";
      range.surroundContents(span);
    }
  }

  const meaning = await getMeaning(text);

  showTooltip(meaning, text);

  if (settings.saveLookups) {
    chrome.storage.sync.get({ lookups: [] }, (data) => {
      data.lookups.push({ text, meaning, date: new Date().toISOString() });
      chrome.storage.sync.set({ lookups: data.lookups });
    });
  }
});

async function getMeaning(text) {
  try {
    const API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your Gemini Pro API key
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=" + API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Explain this in simple words, keeping the context: "${text}"` }] }]
      })
    });

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No definition found.";
  } catch (err) {
    return "Error fetching definition.";
  }
}

function showTooltip(text, original) {
  const tooltip = document.createElement("div");
  tooltip.innerText = text;
  tooltip.style.position = "fixed";
  tooltip.style.background = "#fff";
  tooltip.style.border = "1px solid #ccc";
  tooltip.style.padding = "8px";
  tooltip.style.borderRadius = "8px";
  tooltip.style.boxShadow = "0px 2px 8px rgba(0,0,0,0.2)";
  tooltip.style.top = "20px";
  tooltip.style.right = "20px";
  tooltip.style.zIndex = "999999";
  document.body.appendChild(tooltip);

  setTimeout(() => tooltip.remove(), 8000);
}
