/**
 * 表情包草稿本地存储工具
 * 用于在 meme-editor 页面持久化 memeDrafts，避免刷新后丢失
 */

import { MemeDraft } from '@/types';

const MEME_DRAFTS_KEY = 'ip_creative_meme_drafts';
const ACTIVE_DRAFT_INDEX_KEY = 'ip_creative_active_draft_index';
const EXPORT_WITH_BACKGROUND_KEY = 'ip_creative_export_with_background';

/**
 * 保存表情包草稿到 localStorage
 */
export const saveMemeDrafts = (drafts: MemeDraft[], activeIndex: number, exportWithBackground?: boolean) => {
  try {
    localStorage.setItem(MEME_DRAFTS_KEY, JSON.stringify(drafts));
    localStorage.setItem(ACTIVE_DRAFT_INDEX_KEY, String(activeIndex));
    if (exportWithBackground !== undefined) {
      localStorage.setItem(EXPORT_WITH_BACKGROUND_KEY, String(exportWithBackground));
    }
  } catch (error) {
    console.error('Failed to save meme drafts to localStorage:', error);
    // 如果存储失败（可能是存储空间不足），尝试清理旧数据
    try {
      localStorage.removeItem(MEME_DRAFTS_KEY);
      localStorage.removeItem(ACTIVE_DRAFT_INDEX_KEY);
      localStorage.setItem(MEME_DRAFTS_KEY, JSON.stringify(drafts));
      localStorage.setItem(ACTIVE_DRAFT_INDEX_KEY, String(activeIndex));
      if (exportWithBackground !== undefined) {
        localStorage.setItem(EXPORT_WITH_BACKGROUND_KEY, String(exportWithBackground));
      }
    } catch (retryError) {
      console.error('Failed to save meme drafts after cleanup:', retryError);
    }
  }
};

/**
 * 从 localStorage 加载表情包草稿
 */
export const loadMemeDrafts = (): { drafts: MemeDraft[]; activeIndex: number; exportWithBackground?: boolean } | null => {
  try {
    const draftsStr = localStorage.getItem(MEME_DRAFTS_KEY);
    const activeIndexStr = localStorage.getItem(ACTIVE_DRAFT_INDEX_KEY);
    const exportWithBackgroundStr = localStorage.getItem(EXPORT_WITH_BACKGROUND_KEY);
    
    if (draftsStr) {
      const drafts = JSON.parse(draftsStr);
      const activeIndex = activeIndexStr ? parseInt(activeIndexStr, 10) : 0;
      const exportWithBackground = exportWithBackgroundStr !== null ? exportWithBackgroundStr === 'true' : undefined;
      return { drafts, activeIndex, exportWithBackground };
    }
  } catch (error) {
    console.error('Failed to load meme drafts from localStorage:', error);
  }
  return null;
};

/**
 * 清除表情包草稿
 */
export const clearMemeDrafts = () => {
  try {
    localStorage.removeItem(MEME_DRAFTS_KEY);
    localStorage.removeItem(ACTIVE_DRAFT_INDEX_KEY);
    localStorage.removeItem(EXPORT_WITH_BACKGROUND_KEY);
  } catch (error) {
    console.error('Failed to clear meme drafts from localStorage:', error);
  }
};

