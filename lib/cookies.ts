/**
 * Cookie 工具函数
 * 用于持久化用户登录状态（只存储用户ID）
 */

import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// Cookie 键名
const USER_ID_KEY = 'ip_creative_user_id';

// Cookie 选项（30天过期）
const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 30, // 30天
  path: '/',
  sameSite: 'lax' as const,
} as const;

/**
 * 保存用户ID到 cookie
 */
export const setUserId = (userId: string) => {
  setCookie(USER_ID_KEY, userId, COOKIE_OPTIONS);
};

/**
 * 从 cookie 获取用户ID
 */
export const getUserId = (): string | null => {
  const userId = getCookie(USER_ID_KEY);
  return userId ? String(userId) : null;
};

/**
 * 清除用户ID cookie
 */
export const clearUserId = () => {
  deleteCookie(USER_ID_KEY);
};

/**
 * 检查用户是否已登录（通过 cookie）
 */
export const isAuthenticated = (): boolean => {
  return !!getUserId();
};

