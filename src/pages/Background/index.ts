chrome.action.onClicked.addListener(async (tab) => {
  // Toggle the side panel
  await chrome.sidePanel.toggle();
});

// Set initial state
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
