// background.ts

// Ensure Chrome API types are available
/// <reference types="chrome" />

// Set the side panel behavior
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: Error) => {
    console.error('Error setting side panel behavior:', error);
  });