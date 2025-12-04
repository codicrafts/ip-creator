import { fetchWithTimeout } from "@/lib/request";

// 常量
const API_BASE_URL = "/api/cloud";
const REQUEST_TIMEOUT_MS = 180000; // 3 分钟

// 类型定义
interface CloudFunctionResponse {
  success: 0 | 1;
  message?: string;
  [key: string]: unknown;
}

/**
 * 调用云函数（通过 Next.js API 路由）
 * @param name 云函数名称
 * @param data 传递给云函数的数据
 * @returns 云函数返回结果
 */
export const callCloudFunction = async (
  name: string,
  data: Record<string, unknown> = {}
): Promise<CloudFunctionResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/${name}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      REQUEST_TIMEOUT_MS
    );

    if (!response.ok) {
      let errorMessage = `HTTP 请求失败: ${response.status}`;
      try {
        const error = await response.json();
        errorMessage = (error as { message?: string }).message || errorMessage;
      } catch {
        // 如果解析失败，使用默认错误消息
      }
      return {
        success: 0,
        message: errorMessage,
      };
    }

    const result = (await response.json()) as CloudFunctionResponse;

    // 如果 API 返回的 success 不是 1，返回失败结果
    if (result.success !== 1) {
      return {
        success: 0,
        message: result.message || "调用云函数失败",
      };
    }

    // 成功时返回包含 success: 1 的结果
    return {
      success: 1,
      ...result,
    };
  } catch (error: unknown) {
    console.error(`调用云函数 ${name} 失败:`, error);
    return {
      success: 0,
      message:
        error instanceof Error
          ? error.message
          : `调用云函数 ${name} 失败`,
    };
  }
};
