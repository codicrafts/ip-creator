import { UserTier, DailyUsage } from "@/types";
import { callCloudFunction } from "@/lib/cloud";
import { getUserId } from "@/lib/cookies";

export interface UserInfo {
  userId?: string;
  phone?: string;
  userTier: UserTier;
  sceneUsage: DailyUsage;
  memeUsage: DailyUsage;
  membershipExpiresAt?: number | null; // 会员过期时间（时间戳）
}

/**
 * 获取用户信息（包括使用次数）
 * @param userId 用户ID（可选，如果不提供则从 localStorage 或 cookie 获取）
 * @returns 用户信息
 */
export const getUserInfo = async (userId?: string): Promise<UserInfo> => {
  try {
    // 如果没有提供 userId，尝试从 cookie 获取
    const storedUserId = userId || getUserId();

    if (!storedUserId) {
      return {
        userTier: UserTier.FREE,
        sceneUsage: { date: new Date().toLocaleDateString(), count: 0 },
        memeUsage: { date: new Date().toLocaleDateString(), count: 0 },
      };
    }

    const result = await callCloudFunction("user", {
      action: "getInfo",
      userId: storedUserId,
    });

    // 处理云函数返回结果（API 路由直接返回 { success, data }）
    const response = result;

    if (response.success !== 1) {
      if (response.message === "用户不存在") {
        return {
          userTier: UserTier.FREE,
          sceneUsage: { date: new Date().toLocaleDateString(), count: 0 },
          memeUsage: { date: new Date().toLocaleDateString(), count: 0 },
        };
      }
      throw new Error(response.message || "获取用户信息失败");
    }

    const data = response.data;

    return {
      userId: data.userId,
      phone: data.phone,
      userTier: data.userTier || UserTier.FREE,
      sceneUsage: data.sceneUsage || {
        date: new Date().toLocaleDateString(),
        count: 0,
      },
      memeUsage: data.memeUsage || {
        date: new Date().toLocaleDateString(),
        count: 0,
      },
      membershipExpiresAt: data.membershipExpiresAt || null,
    };
  } catch (error) {
    console.error("Get user info error:", error);
    // 返回默认值而不是抛出错误，确保应用可以继续运行
    return {
      userTier: UserTier.FREE,
      sceneUsage: { date: new Date().toLocaleDateString(), count: 0 },
      memeUsage: { date: new Date().toLocaleDateString(), count: 0 },
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

    return response.data.sceneUsage;
  } catch (error: any) {
    console.error("Update scene usage error:", error);
    throw new Error(error.message || "更新场景扩展使用次数失败");
  }
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

    return response.data.memeUsage;
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

    const data = response.data;
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
export const createOrInitUser = async (): Promise<UserInfo> => {
  try {
    // 通过 API 路由调用（如果需要实现初始化功能）
    const result = await callCloudFunction("user", {
      action: "init",
    });

    const response = result;

    if (response.success !== 1) {
      throw new Error(response.message || "初始化用户失败");
    }

    const data = response.data;

    // 保存 userId 到 cookie（如果需要）
    if (data.userId) {
      const { setUserId } = await import("@/lib/cookies");
      setUserId(data.userId);
    }

    return {
      userId: data.userId,
      userTier: data.userTier || UserTier.FREE,
      sceneUsage: data.sceneUsage || {
        date: new Date().toLocaleDateString(),
        count: 0,
      },
      memeUsage: data.memeUsage || {
        date: new Date().toLocaleDateString(),
        count: 0,
      },
    };
  } catch (error: any) {
    console.error("Create or init user error:", error);
    throw new Error(error.message || "初始化用户失败");
  }
};
