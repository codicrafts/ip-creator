/**
 * 历史记录服务
 * 用于保存和获取用户的创作历史
 */

import { GeneratedImage } from "@/types";
import { callCloudFunction } from "@/lib/cloud";
import { getUserId } from "@/lib/cookies";

export interface HistoryItem extends GeneratedImage {
  userId?: string;
  type: "scene" | "meme"; // 场景扩展或表情包
  createdAt?: Date;
}

export interface SaveHistoryRequest {
  userId?: string;
  type: "scene" | "meme";
  url: string;
  prompt: string;
  style?: string;
}

/**
 * 保存历史记录到数据库
 */
export const saveHistory = async (
  type: "scene" | "meme",
  url: string,
  prompt: string,
  style?: string
): Promise<HistoryItem | null> => {
  try {
    const userId = getUserId();

    const result = await callCloudFunction("history", {
      action: "save",
      userId: userId || undefined,
      type,
      url,
      prompt,
      style,
    });

    if (result.success !== 1) {
      console.error("Failed to save history:", result.message);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Save history error:", error);
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

    const result = await callCloudFunction("history", {
      action: "getList",
      userId: targetUserId,
      limit,
    });

    if (result.success !== 1) {
      console.error("Failed to get history:", result.message);
      return [];
    }

    // 处理不同的返回格式
    // 如果返回的是对象且包含 history 字段，则使用 history 字段
    if (
      result.data &&
      typeof result.data === "object" &&
      !Array.isArray(result.data)
    ) {
      if (result.data.history && Array.isArray(result.data.history)) {
        return result.data.history;
      }
    }

    // 如果返回的是数组，直接返回
    if (Array.isArray(result.data)) {
      return result.data;
    }

    return [];
  } catch (error) {
    console.error("Get history error:", error);
    return [];
  }
};

/**
 * 删除历史记录（支持单个或批量删除）
 */
export const deleteHistory = async (
  historyId: string | string[]
): Promise<boolean> => {
  try {
    const userId = getUserId();

    const result = await callCloudFunction("history", {
      action: "delete",
      userId: userId || undefined,
      historyId: Array.isArray(historyId) ? historyId : [historyId],
    });

    return result.success === 1;
  } catch (error) {
    console.error("Delete history error:", error);
    return false;
  }
};
