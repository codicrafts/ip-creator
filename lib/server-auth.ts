/**
 * 服务端认证工具函数
 * 用于在 SSR 侧获取用户信息
 */

import { cookies } from 'next/headers';
import { UserTier, DailyUsage, GeneratedImage } from '@/types';
import { UserInfo } from '@/services/userService';
import { getTodayDateString } from '@/lib/date-utils';

const USER_ID_KEY = 'ip_creative_user_id';

/**
 * 在服务端获取用户ID（从 cookie）
 */
export async function getServerUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_ID_KEY);
  return userId?.value || null;
}

/**
 * 在服务端获取用户信息
 * @returns 用户信息
 */
export async function getServerUserInfo(): Promise<UserInfo> {
  try {
    const userId = await getServerUserId();

    if (!userId) {
      const today = getTodayDateString();
      return {
        userId: "",
        userTier: UserTier.FREE,
        sceneUsage: { date: today, count: 0 },
        memeUsage: { date: today, count: 0 },
      };
    }

    // 直接从数据库获取用户信息（服务端）
    const { getUserInfoFromDB } = await import('@/lib/db');
    const userData = await getUserInfoFromDB(userId);

    if (!userData) {
      const today = getTodayDateString();
      return {
        userId: "",
        userTier: UserTier.FREE,
        sceneUsage: { date: today, count: 0 },
        memeUsage: { date: today, count: 0 },
      };
    }

    return userData;
  } catch (error) {
    console.error('Get server user info error:', error);
    const today = getTodayDateString();
    return {
      userId: "",
      userTier: UserTier.FREE,
      sceneUsage: { date: today, count: 0 },
      memeUsage: { date: today, count: 0 },
    };
  }
}

/**
 * 在服务端获取用户历史记录
 * @returns 历史记录列表
 */
export async function getServerHistory(): Promise<GeneratedImage[]> {
  try {
    const userId = await getServerUserId();

    if (!userId) {
      return [];
    }

    // 直接从数据库获取历史记录（服务端）
    const { getCloudDB } = await import('@/lib/db');
    const { db } = await getCloudDB();

    const query = db.collection("history")
      .where({ userId: userId })
      .orderBy("timestamp", "desc")
      .limit(50);

    const result = await query.get();
    const historyList = result.data.map((item: any) => ({
      id: item._id,
      url: item.url,
      timestamp: item.timestamp,
      prompt: item.prompt,
      style: item.style,
    }));

    return historyList;
  } catch (error) {
    console.error('Get server history error:', error);
    return [];
  }
}

