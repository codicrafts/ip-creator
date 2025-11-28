/**
 * 场景扩展草稿本地存储工具
 * 用于在 edit 页面持久化 sceneDrafts，避免刷新后丢失
 */

import { SceneDraft } from '@/types';

const SCENE_DRAFTS_KEY = 'ip_creative_scene_drafts';
const ACTIVE_SCENE_DRAFT_INDEX_KEY = 'ip_creative_active_scene_draft_index';

/**
 * 保存场景扩展草稿到 localStorage
 */
export const saveSceneDrafts = (drafts: SceneDraft[], activeIndex: number) => {
  try {
    localStorage.setItem(SCENE_DRAFTS_KEY, JSON.stringify(drafts));
    localStorage.setItem(ACTIVE_SCENE_DRAFT_INDEX_KEY, String(activeIndex));
  } catch (error) {
    console.error('Failed to save scene drafts to localStorage:', error);
    // 如果存储失败（可能是存储空间不足），尝试清理旧数据
    try {
      localStorage.removeItem(SCENE_DRAFTS_KEY);
      localStorage.removeItem(ACTIVE_SCENE_DRAFT_INDEX_KEY);
      localStorage.setItem(SCENE_DRAFTS_KEY, JSON.stringify(drafts));
      localStorage.setItem(ACTIVE_SCENE_DRAFT_INDEX_KEY, String(activeIndex));
    } catch (retryError) {
      console.error('Failed to save scene drafts after cleanup:', retryError);
    }
  }
};

/**
 * 从 localStorage 加载场景扩展草稿
 */
export const loadSceneDrafts = (): { drafts: SceneDraft[]; activeIndex: number } | null => {
  try {
    const draftsStr = localStorage.getItem(SCENE_DRAFTS_KEY);
    const activeIndexStr = localStorage.getItem(ACTIVE_SCENE_DRAFT_INDEX_KEY);
    
    if (draftsStr) {
      const drafts = JSON.parse(draftsStr);
      const activeIndex = activeIndexStr ? parseInt(activeIndexStr, 10) : 0;
      return { drafts, activeIndex };
    }
  } catch (error) {
    console.error('Failed to load scene drafts from localStorage:', error);
  }
  return null;
};

/**
 * 清除场景扩展草稿
 */
export const clearSceneDrafts = () => {
  try {
    localStorage.removeItem(SCENE_DRAFTS_KEY);
    localStorage.removeItem(ACTIVE_SCENE_DRAFT_INDEX_KEY);
  } catch (error) {
    console.error('Failed to clear scene drafts from localStorage:', error);
  }
};

