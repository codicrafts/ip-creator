/**
 * 历史记录服务
 * 用于保存和获取用户的创作历史
 */

import { GeneratedImage } from "@/types";
import { callCloudFunction } from "@/lib/cloud";
import { getUserId } from "@/lib/cookies";

export interface HistoryItem extends GeneratedImage {
  type: "scene" | "meme"; // 场景扩展或表情包
  createdAt?: Date;
}

export interface SaveHistoryRequest {
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

    return result.data as HistoryItem;
  } catch (error) {
    console.error("Save history error:", error);
    return null;
  }
};

/**
 * 批量保存历史记录到数据库
 */
export const batchSaveHistory = async (
  items: Array<{
    type: "scene" | "meme";
    url: string;
    prompt: string;
    style?: string;
    index: number;
  }>
): Promise<
  Array<{ index: number; historyItem?: HistoryItem; error?: string }>
> => {
  try {
    const userId = getUserId();

    // 调用批量保存接口
    const result = await callCloudFunction("history", {
      action: "save",
      userId: userId || undefined,
      items,
    });

    if (result.success !== 1) {
      console.error("Failed to batch save history:", result.message);
      return items.map((item) => ({
        index: item.index,
        error: result.message || "Batch save history failed",
      }));
    }

    // 映射返回结果
    const historyResults = result.data as Array<{
      success: boolean;
      data?: HistoryItem;
      error?: string;
      index: number;
    }>;

    return historyResults.map((res) => {
      if (res.success && res.data) {
        return {
          index: res.index,
          historyItem: res.data,
        };
      } else {
        return {
          index: res.index,
          error: res.error || "Save history failed",
        };
      }
    });
  } catch (error) {
    console.error("Batch save history error:", error);
    return items.map((item) => ({
      index: item.index,
      error: "Batch save history failed",
    }));
  }
};

/**
 * 获取用户的历史记录列表
 */
export const getHistory = async (userId?: string, limit: number = 100) => {
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
      const dataObj = result.data as { history?: any[] };
      if (dataObj.history && Array.isArray(dataObj.history)) {
        return dataObj.history;
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
export const deleteHistory = async (historyId: string | string[]) => {
  try {
    const userId = getUserId();

    if (!userId) {
      return false;
    }

    const result = await callCloudFunction("history", {
      action: "delete",
      userId,
      historyId,
    });

    if (result.success !== 1) {
      console.error("Failed to delete history:", result.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete history error:", error);
    return false;
  }
};
