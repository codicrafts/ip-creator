import { callCloudFunction } from "@/lib/cloud";
import { UserTier, DailyUsage } from "@/types";
import { getTodayDateString } from "@/lib/date-utils";

export interface UserInfo {
  userId: string;
  phone?: string;
  userTier: UserTier;
  sceneUsage: DailyUsage;
  memeUsage: DailyUsage;
  membershipExpiresAt?: number; // 会员过期时间（时间戳）
}

/**
 * 获取用户信息
 * @param userId 用户ID
 * @returns 用户信息
 */
export const getUserInfo = async (userId: string): Promise<UserInfo> => {
  try {
    const result = await callCloudFunction("user", {
      action: "get",
      userId,
    });

    // 处理云函数返回结果（API 路由直接返回 { success, data }）
    const response = result;

    if (response.success !== 1) {
      throw new Error(response.message || "获取用户信息失败");
    }

    const data = response.data as {
      userId: string;
      phone?: string;
      userTier: UserTier;
      sceneUsage: DailyUsage;
      memeUsage: DailyUsage;
      membershipExpiresAt?: number;
    };
    return {
      userId: data.userId,
      phone: data.phone,
      userTier: data.userTier || UserTier.FREE,
      sceneUsage: data.sceneUsage || { date: getTodayDateString(), count: 0 },
      memeUsage: data.memeUsage || { date: getTodayDateString(), count: 0 },
      membershipExpiresAt: data.membershipExpiresAt,
    };
  } catch (error) {
    console.error("Get user info error:", error);
    // 返回默认信息，避免页面崩溃
    return {
      userId,
      phone: undefined,
      userTier: UserTier.FREE,
      sceneUsage: { date: getTodayDateString(), count: 0 },
      memeUsage: { date: getTodayDateString(), count: 0 },
    };
  }
};

/**
 * 更新场景扩展使用次数
 * @param userId 用户ID
 * @param increment 增加的数量（默认为 1）
 * @returns 更新后的使用次数
 */
export const updateSceneUsage = async (
  userId: string,
  increment: number = 1
): Promise<DailyUsage> => {
  try {
    const result = await callCloudFunction("user", {
      action: "updateSceneUsage",
      userId,
      increment,
    });

    // 处理云函数返回结果（API 路由直接返回 { success, data }）
    const response = result;

    if (response.success !== 1) {
      throw new Error(response.message || "更新场景扩展使用次数失败");
    }

    return (response.data as { sceneUsage: DailyUsage }).sceneUsage;
  } catch (error: any) {
    console.error("Update scene usage error:", error);
    throw new Error(error.message || "更新场景扩展使用次数失败");
  }
};

/**
 * 批量更新场景扩展使用次数（目前复用单个更新逻辑，因为通常是一次性更新总数）
 * 如果需要针对每个任务单独更新状态，可以使用此函数
 * 但由于 updateSceneUsage 已经支持 increment 参数，实际上已经支持批量增加
 * 此函数主要用于保持 API 接口一致性
 */
export const batchUpdateSceneUsage = async (
  userId: string,
  count: number
): Promise<DailyUsage> => {
  return updateSceneUsage(userId, count);
};

/**
 * 更新表情包制作使用次数
 * @param userId 用户ID
 * @param increment 增加的数量（默认为 1）
 * @returns 更新后的使用次数
 */
export const updateMemeUsage = async (
  userId: string,
  increment: number = 1
): Promise<DailyUsage> => {
  try {
    const result = await callCloudFunction("user", {
      action: "updateMemeUsage",
      userId,
      increment,
    });

    // 处理云函数返回结果（API 路由直接返回 { success, data }）
    const response = result;

    if (response.success !== 1) {
      throw new Error(response.message || "更新表情包制作使用次数失败");
    }

    return (response.data as { memeUsage: DailyUsage }).memeUsage;
  } catch (error: any) {
    console.error("Update meme usage error:", error);
    throw new Error(error.message || "更新表情包制作使用次数失败");
  }
};

/**
 * 更新用户会员等级
 * @param userId 用户ID
 * @param userTier 新的会员等级
 * @returns 更新后的用户信息
 */
export const updateUserTier = async (
  userId: string,
  userTier: UserTier
): Promise<UserInfo> => {
  try {
    const result = await callCloudFunction("user", {
      action: "updateTier",
      userId,
      userTier,
    });

    // 处理云函数返回结果（API 路由直接返回 { success, data }）
    const response = result;

    if (response.success !== 1) {
      throw new Error(response.message || "更新会员等级失败");
    }

    const data = response.data as {
      userId: string;
      userTier: UserTier;
      sceneUsage: DailyUsage;
      memeUsage: DailyUsage;
    };
    return {
      userId: data.userId,
      userTier: data.userTier,
      sceneUsage: data.sceneUsage,
      memeUsage: data.memeUsage,
    };
  } catch (error: any) {
    console.error("Update user tier error:", error);
    throw new Error(error.message || "更新会员等级失败");
  }
};

/**
 * 创建或初始化用户
 * @returns 用户信息
 */
export const createOrInitUser = async (): Promise<UserInfo | null> => {
  try {
    const result = await callCloudFunction("user", {
      action: "create",
    });

    // 处理云函数返回结果（API 路由直接返回 { success, data }）
    const response = result;

    if (response.success !== 1) {
      console.error("Failed to create/init user:", response.message);
      return null;
    }

    const data = response.data as {
      userId: string;
      userTier: UserTier;
      sceneUsage: DailyUsage;
      memeUsage: DailyUsage;
    };
    return {
      userId: data.userId,
      userTier: data.userTier,
      sceneUsage: data.sceneUsage,
      memeUsage: data.memeUsage,
    };
  } catch (error) {
    console.error("Create user error:", error);
    return null;
  }
};
