import { STORAGE } from '../config';
import { SectionsModel } from '../types';

export class StorageUtils {
  private static readonly HIGHEST_SECTION_INDEX_KEY = 'handynote_highest_section_index';
  private static readonly HIGHEST_ITEM_INDEX_KEY = 'handynote_highest_item_index';

  static async initializeStorage(): Promise<void> {
    const existing = await chrome.storage.local.get([STORAGE.KEY, this.HIGHEST_SECTION_INDEX_KEY, this.HIGHEST_ITEM_INDEX_KEY]);
    if (!existing[STORAGE.KEY]) {
      await chrome.storage.local.set({ [STORAGE.KEY]: [] });
    }
    if (!existing[this.HIGHEST_SECTION_INDEX_KEY]) {
      await chrome.storage.local.set({ [this.HIGHEST_SECTION_INDEX_KEY]: 0 });
    }
    if (!existing[this.HIGHEST_ITEM_INDEX_KEY]) {
      await chrome.storage.local.set({ [this.HIGHEST_ITEM_INDEX_KEY]: 0 });
    }
  }

  static async getSections(): Promise<SectionsModel> {
    const result = await chrome.storage.local.get(STORAGE.KEY);
    // console.log(`${Date.now()} getSections: ${JSON.stringify(result)}`);
    return result[STORAGE.KEY] || [];
  }

  static async setSections(sections: SectionsModel): Promise<void> {
    await chrome.storage.local.set({ [STORAGE.KEY]: sections });
    // console.log(`${Date.now()} setSections: ${JSON.stringify(sections)}`);
  }
}