/**
 * 数据库操作共享函数
 * 供 SSR 和 API 路由使用
 */

import { UserTier } from "@/types";
import { getTodayDateString, normalizeDateString } from "@/lib/date-utils";

// 动态导入 wx-server-sdk（CommonJS 模块）
let cloudInstance: any;
let dbInstance: any;

export async function getCloudDB() {
  if (!cloudInstance) {
    // 使用动态导入处理 CommonJS 模块
    const wxServerSDK = await import("wx-server-sdk");
    cloudInstance = (wxServerSDK as any).default || wxServerSDK;

    // 配置云开发（需要 secretId 和 secretKey）
    const initConfig: any = {
      env: "cloudbase-5gqcz0ab010d3288",
    };

    // 从环境变量获取腾讯云凭证（如果配置了）
    const secretId = process.env.TENCENT_CLOUD_SECRET_ID;
    const secretKey = process.env.TENCENT_CLOUD_SECRET_KEY;

    if (secretId && secretKey) {
      initConfig.secretId = secretId;
      initConfig.secretKey = secretKey;
    }

    cloudInstance.init(initConfig);
    dbInstance = cloudInstance.database();
  }
  return { cloud: cloudInstance, db: dbInstance };
}

/**
 * 获取用户信息（返回普通对象，不包含 NextResponse）
 */
export async function getUserInfoFromDB(userId: string) {
  try {
    const { db } = await getCloudDB();
    const today = getTodayDateString();

    const result = await db.collection("users").doc(userId).get();

    if (!result.data) {
      return null;
    }

    const user = result.data;

    // 检查是否需要重置每日使用量
    let sceneUsage = user.sceneUsage || { date: today, count: 0 };
    let memeUsage = user.memeUsage || { date: today, count: 0 };

    // 统一日期格式后比较
    const sceneUsageDate = normalizeDateString(sceneUsage.date);
    const memeUsageDate = normalizeDateString(memeUsage.date);

    if (sceneUsageDate !== today) {
      sceneUsage = { date: today, count: 0 };
    } else {
      // 确保日期格式统一
      sceneUsage = { ...sceneUsage, date: today };
    }
    if (memeUsageDate !== today) {
      memeUsage = { date: today, count: 0 };
    } else {
      // 确保日期格式统一
      memeUsage = { ...memeUsage, date: today };
    }

    return {
      userId: user._id,
      phone: user.phone,
      userTier: (user.userTier || "FREE") as UserTier,
      sceneUsage: sceneUsage,
      memeUsage: memeUsage,
      membershipExpiresAt: user.membershipExpiresAt || null,
    };
  } catch (error) {
    console.error("Get user info from DB error:", error);
    return null;
  }
}
