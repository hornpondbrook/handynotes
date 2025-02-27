import { Sections, ShortcutItem } from '../types';
import { StorageUtils } from '../utils/storage';

export const initializeInitialSections = async (): Promise<Sections> => {
  const initialData = [
    {
      title: "VS Code Shortcuts - General",
      items: [
        { key: "Ctrl+Shift+P", desc: "Show Command Palette" },
        { key: "Ctrl+P", desc: "Quick Open, Go to File…" },
        { key: "Ctrl+Shift+N", desc: "New Window/instance" },
        { key: "Ctrl+Shift+W", desc: "Close Window/instance" },
        { key: "Ctrl+K Ctrl+S", desc: "Open Keyboard Shortcuts" },
      ]
    },
    {
      title: "VS Code Shortcuts - Basic editing",
      items: [
        { key: "Ctrl+X", desc: "Cut line (empty selection)" },
        { key: "Ctrl+C", desc: "Copy line (empty selection)" },
        { key: "Alt+Shift+Down", desc: "Copy line down" },
        { key: "Alt+Shift+Up", desc: "Copy line up" },
        { key: "Alt+Up", desc: "Move line up" },
        { key: "Alt+Down", desc: "Move line down" },
        { key: "Ctrl+Shift+K", desc: "Delete line" },
        { key: "Ctrl+Enter", desc: "Insert line below" },
        { key: "Ctrl+Shift+Enter", desc: "Insert line above" },
        { key: "Ctrl+Shift+\\", desc: "Jump to matching bracket" },
        { key: "Ctrl+]", desc: "Indent line" },
        { key: "Ctrl+[", desc: "Outdent line" },
        { key: "Ctrl+Home", desc: "Go to beginning of file" },
        { key: "Ctrl+End", desc: "Go to end of file" },
        { key: "Ctrl+Shift+Home", desc: "Select to beginning of file" },
        { key: "Ctrl+Shift+End", desc: "Select to end of file" },
        { key: "Ctrl+U", desc: "Undo last cursor operation" },
      ]
    },
    {
      title: "VS Code Shortcuts - Editor management",
      items: [
        { key: "Ctrl+F4", desc: "Close editor" },
        { key: "Ctrl+K F4", desc: "Close all editors" },
        { key: "Ctrl+K Ctrl+W", desc: "Close all editors in group" },
        { key: "Ctrl+Tab", desc: "Open next editor" },
        { key: "Ctrl+Shift+Tab", desc: "Open previous editor" },
        { key: "Ctrl+K Ctrl+Left", desc: "Open previous editor in group" },
        { key: "Ctrl+K Ctrl+Right", desc: "Open next editor in group" },
        { key: "Ctrl+K Ctrl+Number", desc: "Open editor at index in group" },
        { key: "Ctrl+1", desc: "Focus the 1st editor group" },
        { key: "Ctrl+2", desc: "Focus the 2nd editor group" },
        { key: "Ctrl+3", desc: "Focus the 3rd editor group" },
        { key: "Ctrl+K Ctrl+Shift+O", desc: "Show active file in new window/instance" },
        { key: "Ctrl+K W", desc: "Close all editors in group" },
      ]
    },
    {
      title: "VS Code Shortcuts",
      items: [
        { key: "F12", desc: "Go to Definition" },
        { key: "Ctrl+Shift+-", desc: "Go Forward" },
        { key: "Ctrl+Alt+-", desc: "Go Back" },
        { key: "Ctrl+Alt+I", desc: "Toggle Copilot Chat View" }
      ]
    },
    {
      title: "Terminator Shortcuts",
      items: [
        { key: "Ctrl+Alt+T", desc: "Launch Terminator" },
        { key: "Ctrl+Shift+T", desc: "New Tab" },
        { key: "Ctrl+PageDown", desc: "Navigate Tab" },
        { key: "Ctrl+Shift+O", desc: "Horizontal Split" },
        { key: "Ctrl+Shift+E", desc: "Vertical Split" },
        { key: "Ctrl+Tab", desc: "Navigate Split" }
      ]
    },
    {
      title: "Ubuntu Shortcuts",
      items: [
        { key: "Ctrl+Shift+I", desc: "Toggle Browser Inspect" },
        { key: "Win+Space", desc: "Toggle Language" },
        { key: "Alt+PrtSc", desc: "Take a Screenshot of Current Window" }
      ]
    }
  ];

  let sections: Sections = [];
  for (let i = 0; i < initialData.length; i++) {
    const sectionData = initialData[i];
    const sectionId = await StorageUtils.generateSectionId(sectionData.title);
    let items: ShortcutItem[] = [];
    for (let j = 0; j < sectionData.items.length; j++) {
      const itemData = sectionData.items[j];
      const itemId = await StorageUtils.generateItemId();
      items.push({
        id: itemId,
        shortcut: itemData.key,
        description: itemData.desc
      });
    }
    sections.push({
      id: sectionId,
      title: sectionData.title,
      items: items
    });
  }
  return sections;
};
