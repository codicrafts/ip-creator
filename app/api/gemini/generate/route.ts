import { NextRequest, NextResponse } from "next/server";
import { request } from "@/lib/request";
import { REQUEST_TIMEOUT_MS } from "@/lib/gemini-utils";
import type {
  GeminiErrorResponse,
  GeminiSuccessResponse,
} from "@/lib/gemini-utils";

// 常量定义
const DEFAULT_API_BASE_URL =
  "https://api.laozhang.ai/v1beta/models/gemini-2.5-flash-image:generateContent";
const API_BASE_URL = process.env.GEMINI_API_BASE_URL || DEFAULT_API_BASE_URL;

// 类型定义
interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text?: string;
      inlineData?: {
        data: string;
        mimeType: string;
      };
    }>;
  }>;
  generationConfig?: Record<string, unknown>;
}

// 批量请求项
interface BatchRequestItem extends GeminiRequest {
  index: number;
}

// 批量请求体
interface BatchRequestBody {
  paths: BatchRequestItem[];
}

interface ErrorResponse {
  error: string;
  details?: string;
  timeout?: boolean;
}

/**
 * 获取并验证 API Key
 * @throws {Error} 如果 API Key 未设置或为空
 */
function getApiKey(): string {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error("API_KEY is not set or is empty");
  }
  return apiKey.trim();
}

/**
 * 验证请求体
 * @throws {Error} 如果请求体无效
 */
function validateRequest(body: unknown): void {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request: body is required");
  }
}

/**
 * 处理 API 错误响应
 */
async function handleErrorResponse(
  response: Response,
  context: string = ""
): Promise<string> {
  let errorText: string;
  try {
    const errorData = await response.json();
    errorText = JSON.stringify(errorData, null, 2);
    console.error(`[Gemini API] Error Response ${context}:`, {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
    });
  } catch {
    errorText = await response.text();
    console.error(`[Gemini API] Error Response (text) ${context}:`, {
      status: response.status,
      statusText: response.statusText,
      text: errorText.substring(0, 200),
    });
  }
  return `API request failed: ${response.status} ${response.statusText} - ${errorText}`;
}

/**
 * 创建错误响应
 */
function createErrorResponse(
  error: string,
  status: number,
  details?: string,
  timeout?: boolean
): NextResponse<ErrorResponse> {
  const errorResponse: ErrorResponse = {
    error,
    ...(details && { details }),
    ...(timeout !== undefined && { timeout }),
  };
  return NextResponse.json(errorResponse, { status });
}

/**
 * 处理不同类型的错误
 */
function handleError(error: unknown): NextResponse<ErrorResponse> {
  console.error("[Gemini API] Error:", error);

  if (!(error instanceof Error)) {
    return createErrorResponse("Internal server error", 500);
  }

  const { message } = error;

  // 网络错误和超时
  if (message.includes("timeout") || message.includes("Network")) {
    const isTimeout = message.includes("timeout");
    return createErrorResponse(
      isTimeout
        ? "请求超时，图片生成可能需要更长时间，请稍后重试"
        : `Network error: ${message}`,
      504,
      undefined,
      isTimeout
    );
  }

  // 验证错误
  if (message.includes("Invalid request") || message.includes("API_KEY")) {
    const status = message.includes("API_KEY") ? 500 : 400;
    return createErrorResponse(message, status);
  }

  // 未知错误
  return createErrorResponse(message || "Internal server error", 500);
}

/**
 * 从成功响应中提取图片数据
 */
function extractImageFromResponse(data: GeminiSuccessResponse): string {
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

/**
 * 处理单个 Gemini 请求
 */
async function processSingleRequest(
  requestBody: GeminiRequest,
  apiKey: string
): Promise<string> {
  const response = await request(
    API_BASE_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    },
    REQUEST_TIMEOUT_MS
  );

  if (!response.ok) {
    const errorMessage = await handleErrorResponse(response);
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return extractImageFromResponse(data);
}

/**
 * POST /api/gemini/generate
 * 代理 Gemini API 调用（服务端），支持单个请求和批量请求
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 获取并验证 API Key
    const apiKey = getApiKey();

    // 解析并验证请求体
    let body: any;
    try {
      body = await req.json();
    } catch (error) {
      return createErrorResponse(
        "Invalid request: failed to parse JSON body",
        400
      );
    }

    validateRequest(body);

    // 检查是否为批量请求
    if (body.paths && Array.isArray(body.paths)) {
      const batchBody = body as BatchRequestBody;
      console.log(
        `[Gemini API] Processing batch request with ${batchBody.paths.length} items`
      );

      // 并行处理所有请求
      const results = await Promise.all(
        batchBody.paths.map(async (item) => {
          try {
            const requestBody: GeminiRequest = {
              contents: item.contents,
              generationConfig: item.generationConfig,
            };
            const result = await processSingleRequest(requestBody, apiKey);
            return {
              index: item.index,
              result: result,
            };
          } catch (error: any) {
            console.error(
              `[Gemini API] Error processing item ${item.index}:`,
              error
            );
            return {
              index: item.index,
              error: error.message || "Generation failed",
            };
          }
        })
      );

      return NextResponse.json({ results });
    } else {
      // 单个请求处理（原有逻辑）
      const requestBody: GeminiRequest = {
        contents: body.contents,
        ...(body.generationConfig && {
          generationConfig: body.generationConfig,
        }),
      };

      if (
        !requestBody.contents ||
        !Array.isArray(requestBody.contents) ||
        requestBody.contents.length === 0
      ) {
        throw new Error(
          "Invalid request: contents is required and must be a non-empty array"
        );
      }

      console.log("[Gemini API] Sending single request");
      const result = await processSingleRequest(requestBody, apiKey);

      // 为了保持兼容性，这里我们手动构建回 success response 的结构
      // 因为 extractImageFromResponse 已经提取了 image data string
      // 我们需要还原成 GeminiSuccessResponse 结构或者直接返回 image string？
      // 原有逻辑是直接返回 data (Gemini API 的原始响应)，客户端再提取
      // 但 processSingleRequest 已经提取了。
      // 为了最小化改动，我们需要修改一下 processSingleRequest 让它返回原始数据
      // 或者修改这里直接返回原始数据。

      // 让我们回退一点，processSingleRequest 最好返回原始 JSON
      // 重新定义 processSingleRequest

      const response = await request(
        API_BASE_URL,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        },
        REQUEST_TIMEOUT_MS
      );

      if (!response.ok) {
        const errorMessage = await handleErrorResponse(response);
        // 这里如果是单个请求，我们应该返回错误响应而不是抛出错误，以便前端能拿到 status code
        // 但是之前逻辑是 handleErrorResponse 返回 NextResponse
        return createErrorResponse(errorMessage, response.status);
      }

      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error: unknown) {
    return handleError(error);
  }
}
