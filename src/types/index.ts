export interface ShortcutItem {
  id: string;
  shortcut: string;
  description: string;
}

export interface Section {
  id: string;
  title: string;
  items: ShortcutItem[];
  isNew?: boolean;
}

export type Sections = Section[];