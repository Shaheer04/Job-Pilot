// background.js
const API_URL = "https://shaheer-ipynb-jobpilot-api.hf.space";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "extractJob",
      title: "Extract to JobPilot",
      contexts: ["selection"]
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "extractJob") {
    console.log("1. Background: Context menu clicked.");
    
    // Force injection of content script in case it's missing or orphaned
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["content.css"]
      });
      
      console.log("2. Background: Content script injected manually.");

      // Small delay to let script register listener
      setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, { 
          action: "START_EXTRACTION", 
          text: info.selectionText,
          source: tab.url.includes("linkedin") ? "LinkedIn Post" : "External"
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("3. Background Error:", chrome.runtime.lastError.message);
          } else {
            console.log("3. Background Success:", response);
          }
        });
      }, 100);

    } catch (err) {
      console.error("Failed to inject script:", err);
    }
  }
});

// CENTRAL API HANDLER
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "CALL_API") {
    handleApiCall(request, sendResponse);
    return true; 
  } else if (request.action === "LOGIN") {
    handleLogin(request, sendResponse);
    return true;
  }
  return true;
});

async function handleLogin(request, sendResponse) {
  try {
    const response = await fetch(`${API_URL}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request.body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Invalid credentials");
    await chrome.storage.local.set({ access_token: data.access });
    sendResponse({ success: true });
  } catch (err) {
    sendResponse({ success: false, error: err.message });
  }
}

async function handleApiCall(request, sendResponse) {
  try {
    const { access_token } = await chrome.storage.local.get(["access_token"]);
    if (!access_token) return sendResponse({ success: false, error: "AUTH_REQUIRED" });

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`
    };

    const response = await fetch(`${API_URL}${request.endpoint}`, {
      method: request.method || "GET",
      headers: headers,
      body: request.body ? JSON.stringify(request.body) : null
    });

    if (response.status === 401) {
       await chrome.storage.local.remove(["access_token"]);
       return sendResponse({ success: false, error: "AUTH_EXPIRED" });
    }

    const data = await response.json();
    if (!response.ok) {
       console.error("BG: API Error Response:", data);
       throw new Error(JSON.stringify(data) || "API Error");
    }
    sendResponse({ success: true, data });
  } catch (err) {
    sendResponse({ success: false, error: err.message });
  }
}
