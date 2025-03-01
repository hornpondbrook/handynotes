import { SectionModel, Sections } from '../types';

export class StorageUtils {
  private static readonly STORAGE_KEY = 'handynote_sections';
  private static readonly HIGHEST_SECTION_INDEX_KEY = 'handynote_highest_section_index';
  private static readonly HIGHEST_ITEM_INDEX_KEY = 'handynote_highest_item_index';

  static async initializeStorage(): Promise<void> {
    const existing = await chrome.storage.local.get([this.STORAGE_KEY, this.HIGHEST_SECTION_INDEX_KEY, this.HIGHEST_ITEM_INDEX_KEY]);
    if (!existing[this.STORAGE_KEY]) {
      await chrome.storage.local.set({ [this.STORAGE_KEY]: [] });
    }
    if (!existing[this.HIGHEST_SECTION_INDEX_KEY]) {
      await chrome.storage.local.set({ [this.HIGHEST_SECTION_INDEX_KEY]: 0 });
    }
    if (!existing[this.HIGHEST_ITEM_INDEX_KEY]) {
      await chrome.storage.local.set({ [this.HIGHEST_ITEM_INDEX_KEY]: 0 });
    }
  }

  static async getSections(): Promise<Sections> {
    const result = await chrome.storage.local.get(this.STORAGE_KEY);
    return result[this.STORAGE_KEY] || [];
  }

  static async setSections(sections: Sections): Promise<void> {
    await chrome.storage.local.set({ [this.STORAGE_KEY]: sections });
  }

  static async addSection(section: SectionModel): Promise<void> {
    const sections = await this.getSections();
    sections.push(section);
    await this.setSections(sections);
    const highestSectionIndex = await this.getHighestSectionIndex();
    await chrome.storage.local.set({ [this.HIGHEST_SECTION_INDEX_KEY]: highestSectionIndex + 1 });
  }

  static async updateSection(sectionId: string, updatedSection: SectionModel): Promise<void> {
    const sections = await this.getSections();
    const index = sections.findIndex(s => s.id === sectionId);
    if (index !== -1) {
      sections[index] = updatedSection;
      await this.setSections(sections);
    }
  }

  static async deleteSection(sectionId: string): Promise<void> {
    const sections = await this.getSections();
    const filtered = sections.filter(s => s.id !== sectionId);
    await this.setSections(filtered);
  }

  static async getHighestSectionIndex(): Promise<number> {
    const result = await chrome.storage.local.get(this.HIGHEST_SECTION_INDEX_KEY);
    return result[this.HIGHEST_SECTION_INDEX_KEY] || 0;
  }

  static async getHighestItemIndex(): Promise<number> {
    const result = await chrome.storage.local.get(this.HIGHEST_ITEM_INDEX_KEY);
    return result[this.HIGHEST_ITEM_INDEX_KEY] || 0;
  }

  static async generateSectionId(title: string): Promise<string> {
    const urlFriendlyTitle = title.toLowerCase().replace(/\s+/g, '-');
    const highestSectionIndex = await this.getHighestSectionIndex();
    return `${urlFriendlyTitle}-${highestSectionIndex + 1}`;
  }

  static async generateItemId(): Promise<string> {
    const highestItemIndex = await this.getHighestItemIndex();
    return `${highestItemIndex + 1}`;
  }
}