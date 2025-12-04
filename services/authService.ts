import { callCloudFunction } from "@/lib/cloud";
import {
  setUserId,
  clearUserId,
  getUserId,
  isAuthenticated as isAuthenticatedCookie,
} from "@/lib/cookies";
import { getUserInfo } from "@/services/userService";

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  phone: string;
  userTier: "FREE" | "PREMIUM";
  token?: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
}

export interface RegisterResponse {
  userId: string;
  phone: string;
  userTier: "FREE";
  token?: string;
}

export interface SendSmsCodeRequest {
  phone: string;
}

export interface SendSmsCodeResponse {
  success: boolean;
  message: string;
  code?: string; // 仅开发环境返回
}

export interface VerifySmsCodeRequest {
  phone: string;
  code: string;
}

export interface VerifySmsCodeResponse {
  userId: string;
  phone: string;
  userTier: "FREE" | "PREMIUM";
  sceneUsage: { date: string; count: number };
  memeUsage: { date: string; count: number };
}

/**
 * 用户登录
 * @param phone 手机号
 * @param password 密码
 * @returns 登录响应
 */
export const login = async (
  phone: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const result = await callCloudFunction("auth", {
      action: "login",
      phone,
      password,
    });
    console.log("result", result);

    // 处理云函数返回结果（API 路由直接返回 { success, data }）
    const response = result;

    if (response.success !== 1) {
      throw new Error(response.message || "登录失败");
    }

    const data = response.data;

    // 只保存用户ID到 cookie（持久化登录态）
    setUserId(data.userId);

    return {
      userId: data.userId,
      phone: data.phone,
      userTier: data.userTier,
    };
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.message || "登录失败");
  }
};

/**
 * 用户注册
 * @param phone 手机号
 * @param password 密码
 * @returns 注册响应
 */
export const register = async (
  phone: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    const result = await callCloudFunction("auth", {
      action: "register",
      phone,
      password,
    });

    // 处理云函数返回结果（API 路由直接返回 { success, data }）
    const response = result;

    if (response.success !== 1) {
      throw new Error(response.message || "注册失败");
    }

    const data = response.data;

    // 只保存用户ID到 cookie（持久化登录态）
    setUserId(data.userId);

    return {
      userId: data.userId,
      phone: data.phone,
      userTier: data.userTier,
    };
  } catch (error: any) {
    console.error("Register error:", error);
    throw new Error(error.message || "注册失败");
  }
};

/**
 * 用户登出
 */
export const logout = async (): Promise<void> => {
  try {
    // 微信云开发不需要服务端登出，直接清除 cookie 即可
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // 清除 cookie
    clearUserId();
    // 清除本地存储的使用次数（游客状态使用）
    localStorage.removeItem("ip_creative_scene_usage");
    localStorage.removeItem("ip_creative_meme_usage");
  }
};

/**
 * 检查用户是否已登录
 * @returns 是否已登录
 */
export const isAuthenticated = (): boolean => {
  return isAuthenticatedCookie();
};

/**
 * 获取当前用户ID
 * @returns 用户ID或null
 */
export const getCurrentUserId = (): string | null => {
  return getUserId();
};

/**
 * 获取当前用户手机号（从后端获取）
 * @returns 手机号或null
 */
export const getCurrentUserPhone = async (): Promise<string | null> => {
  const userId = getUserId();
  if (!userId) {
    return null;
  }
  try {
    const userInfo = await getUserInfo(userId);
    return userInfo.phone || null;
  } catch (error) {
    console.error("Failed to get user phone:", error);
    return null;
  }
};

/**
 * 发送短信验证码
 * @param phone 手机号
 * @returns 发送结果
 */
export const sendSmsCode = async (
  phone: string
): Promise<SendSmsCodeResponse> => {
  try {
    const response = await fetch("/api/auth/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    const result = await response.json();

    if (result.success !== 1) {
      throw new Error(result.message || "发送验证码失败");
    }

    return {
      success: true,
      message: result.message || "验证码已发送",
      code: result.data?.code, // 仅开发环境有值
    };
  } catch (error: any) {
    console.error("Send SMS code error:", error);
    throw new Error(error.message || "发送验证码失败");
  }
};

/**
 * 验证短信验证码并登录/注册
 * @param phone 手机号
 * @param code 验证码
 * @returns 登录响应
 */
export const verifySmsCode = async (
  phone: string,
  code: string
): Promise<VerifySmsCodeResponse> => {
  try {
    const response = await fetch("/api/auth/sms/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, code }),
    });

    const result = await response.json();

    if (result.success !== 1) {
      throw new Error(result.message || "验证失败");
    }

    const data = result.data;

    // 保存用户ID到 cookie（持久化登录态）
    setUserId(data.userId);

    return {
      userId: data.userId,
      phone: data.phone,
      userTier: data.userTier,
      sceneUsage: data.sceneUsage,
      memeUsage: data.memeUsage,
    };
  } catch (error: any) {
    console.error("Verify SMS code error:", error);
    throw new Error(error.message || "验证失败");
  }
};
