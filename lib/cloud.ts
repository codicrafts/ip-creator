/**
 * 云函数调用封装（通过 Next.js API 路由）
 * 在服务端使用 wx-server-sdk 调用云函数
 */

// API 基础路径
const API_BASE_URL = "/api/cloud";

/**
 * 调用云函数（通过 Next.js API 路由）
 * @param name 云函数名称
 * @param data 传递给云函数的数据
 * @returns 云函数返回结果
 */
export const callCloudFunction = async (
  name: string,
  data: any = {}
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: 0,
        message: error.message || `HTTP 请求失败: ${response.status}`,
      };
    }

    const result = await response.json();

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
  } catch (error: any) {
    console.error(`调用云函数 ${name} 失败:`, error);
    return {
      success: 0,
      message: error.message || `调用云函数 ${name} 失败`,
    };
  }
};
