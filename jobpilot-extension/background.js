// background.js
const API_URL = "http://127.0.0.1:8000";

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "extractJob",
    title: "Extract to JobPilot",
    contexts: ["selection"]
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "extractJob") {
    // Store the selected text temporarily
    chrome.storage.local.set({ 
      pendingSelection: info.selectionText,
      pendingSource: tab.url.includes("linkedin") ? "LinkedIn Post" : "External"
    });
  }
});

// Handle messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SET_TOKEN") {
    chrome.storage.local.set({ access_token: request.token }, () => {
      sendResponse({ status: "success" });
    });
  } else if (request.action === "GET_TOKEN") {
    chrome.storage.local.get(["access_token"], (result) => {
      sendResponse({ token: result.access_token });
    });
  }
  return true;
});
