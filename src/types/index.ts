export interface SectionModel {
  id: string;
  title: string;
  items: ItemModel[];
}

export interface ItemModel {
  id: string;
  shortcut: string;
  description: string;
}

export type SectionsModel = SectionModel[];