import { Sections, Section, ShortcutItem } from '../types';
import { StorageUtils } from '../utils/storage';

export const initializeInitialSections = async (): Promise<Sections> => {
  const initialData = [
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
