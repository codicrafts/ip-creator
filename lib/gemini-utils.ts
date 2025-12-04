/**
 * Gemini API 工具函数
 */

// 常量
export const REQUEST_TIMEOUT_MS = 600000; // 10 分钟（高分辨率图片生成可能需要更长时间）
export const API_BASE_URL = "/api/gemini/generate";

// 类型定义
export interface GeminiErrorResponse {
  error?:
    | string
    | {
        message?: string;
        localized_message?: string;
        type?: string;
        code?: number;
        param?: string;
      };
  details?: string;
}

export interface GeminiSuccessResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: {
          data: string;
          mimeType: string;
        };
        text?: string;
      }>;
    };
  }>;
}

/**
 * 从错误响应中提取错误消息
 */
export function extractErrorMessage(
  errorData: GeminiErrorResponse,
  defaultMessage: string
): string {
  if (!errorData.error) {
    return errorData.details || defaultMessage;
  }

  // 处理字符串类型的错误
  if (typeof errorData.error === "string") {
    return errorData.details
      ? `${errorData.error}: ${errorData.details}`
      : errorData.error;
  }

  // 处理对象类型的错误
  const error = errorData.error;
  if (error.message?.trim()) {
    return error.message;
  }
  if (error.localized_message?.trim()) {
    return error.localized_message;
  }

  // 使用 type、code、param 构建错误消息
  const errorParts: string[] = [];
  if (error.type) {
    errorParts.push(`类型: ${error.type}`);
  }
  if (error.code) {
    errorParts.push(`代码: ${error.code}`);
  }
  if (error.param) {
    errorParts.push(`参数: ${error.param}`);
  }

  return errorParts.length > 0
    ? errorParts.join(", ")
    : JSON.stringify(error) || defaultMessage;
}

/**
 * 处理 Gemini API 错误响应
 */
export async function handleGeminiError(
  response: Response,
  generationConfig?: Record<string, unknown>
): Promise<never> {
  const status = response.status || 500;
  const statusText = response.statusText || "Unknown Error";
  let errorMessage = `API request failed: ${status} ${statusText}`;
  let errorData: GeminiErrorResponse | null = null;

  // 记录响应状态信息
  console.error(
    `[Gemini Error] Response status: ${status} ${statusText}, ok: ${response.ok}`
  );

  // 记录请求配置（如果有）
  if (generationConfig) {
    console.log(
      "[Gemini Error] Request generationConfig:",
      JSON.stringify(generationConfig, null, 2)
    );
  }

  try {
    // 尝试读取响应文本
    let responseText: string;
    try {
      responseText = await response.text();
      console.error(
        `[Gemini Error] Response text length: ${
          responseText.length
        }, content: ${responseText.substring(0, 200)}`
      );
    } catch (readError: any) {
      // 如果读取失败，可能是 Response 对象已经被读取过
      console.error("Failed to read response body:", readError);
      errorMessage = `API request failed: ${status} ${statusText} (unable to read response body)`;
      throw new Error(errorMessage);
    }

    // 如果响应文本为空，使用状态码信息
    if (!responseText || responseText.trim().length === 0) {
      errorMessage = `API request failed: ${status} ${statusText} (empty response body)`;
      console.error("Gemini API Error: Empty response body");
      throw new Error(errorMessage);
    }

    // 尝试解析 JSON
    try {
      errorData = JSON.parse(responseText);
      console.error("Gemini API Error Data:", errorData);

      // 检查是否是空对象
      if (
        errorData &&
        typeof errorData === "object" &&
        Object.keys(errorData).length === 0
      ) {
        errorMessage = `API request failed: ${status} ${statusText} (empty error object - API may have returned an empty response)`;
        console.error("Gemini API Error: Empty error object detected");
      } else if (errorData) {
        errorMessage = extractErrorMessage(errorData, errorMessage);
      }
    } catch (jsonError) {
      // 如果不是 JSON，使用原始文本
      console.error("Gemini API Error (text, not JSON):", responseText);
      errorMessage = responseText || errorMessage;
    }
  } catch (error: any) {
    // 如果已经抛出了错误，直接抛出
    if (error instanceof Error) {
      throw error;
    }
    // 其他情况，使用默认错误消息
    console.error("Failed to process error response:", error);
  }

  throw new Error(errorMessage);
}

/**
 * 从成功响应中提取图片数据
 */
export function extractImageFromResponse(data: GeminiSuccessResponse): string {
  const responseParts = data.candidates?.[0]?.content?.parts;
  if (!responseParts) {
    throw new Error("No content generated");
  }

  for (const part of responseParts) {
    if (part.inlineData?.data) {
      const outputMimeType = part.inlineData.mimeType || "image/png";
      return `data:${outputMimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image data found in the response");
}
