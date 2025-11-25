/**
 * 历史记录服务
 * 用于保存和获取用户的创作历史
 */

import { GeneratedImage } from '@/types';
import { callCloudFunction } from '@/lib/cloud';
import { getUserId } from '@/lib/cookies';

export interface HistoryItem extends GeneratedImage {
  userId?: string;
  type: 'scene' | 'meme'; // 场景扩展或表情包
  createdAt?: Date;
}

export interface SaveHistoryRequest {
  userId?: string;
  type: 'scene' | 'meme';
  url: string;
  prompt: string;
  style?: string;
}

/**
 * 保存历史记录到数据库
 */
export const saveHistory = async (
  type: 'scene' | 'meme',
  url: string,
  prompt: string,
  style?: string
): Promise<HistoryItem | null> => {
  try {
    const userId = getUserId();

    const result = await callCloudFunction('history', {
      action: 'save',
      userId: userId || undefined,
      type,
      url,
      prompt,
      style,
    });

    if (result.success !== 1) {
      console.error('Failed to save history:', result.message);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Save history error:', error);
    return null;
  }
};

/**
 * 获取用户的历史记录列表
 */
export const getHistory = async (
  userId?: string,
  limit: number = 50
): Promise<HistoryItem[]> => {
  try {
    const targetUserId = userId || getUserId();

    if (!targetUserId) {
      return [];
    }

    const result = await callCloudFunction('history', {
      action: 'getList',
      userId: targetUserId,
      limit,
    });

    if (result.success !== 1) {
      console.error('Failed to get history:', result.message);
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error('Get history error:', error);
    return [];
  }
};

/**
 * 删除历史记录
 */
export const deleteHistory = async (historyId: string): Promise<boolean> => {
  try {
    const userId = getUserId();

    const result = await callCloudFunction('history', {
      action: 'delete',
      userId: userId || undefined,
      historyId,
    });

    return result.success === 1;
  } catch (error) {
    console.error('Delete history error:', error);
    return false;
  }
};

