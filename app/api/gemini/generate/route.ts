import { NextRequest, NextResponse } from "next/server";
import { request } from "@/lib/request";
import { REQUEST_TIMEOUT_MS } from "@/lib/gemini-utils";
import type { GeminiErrorResponse } from "@/lib/gemini-utils";

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
function validateRequest(body: unknown): asserts body is GeminiRequest {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request: body is required");
  }

  const requestBody = body as GeminiRequest;
  if (
    !requestBody.contents ||
    !Array.isArray(requestBody.contents) ||
    requestBody.contents.length === 0
  ) {
    throw new Error(
      "Invalid request: contents is required and must be a non-empty array"
    );
  }
}

/**
 * 处理 API 错误响应
 */
async function handleErrorResponse(
  response: Response,
  requestBody: GeminiRequest
): Promise<NextResponse<ErrorResponse>> {
  let errorText: string;
  let errorData: GeminiErrorResponse | null = null;

  try {
    errorData = await response.json();
    errorText = JSON.stringify(errorData, null, 2);
    console.error("[Gemini API] Error Response:", {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
    });

    if (requestBody.generationConfig) {
      console.error(
        "[Gemini API] Request generationConfig:",
        JSON.stringify(requestBody.generationConfig, null, 2)
      );
    }
  } catch {
    errorText = await response.text();
    console.error("[Gemini API] Error Response (text):", {
      status: response.status,
      statusText: response.statusText,
      text: errorText.substring(0, 200),
    });
  }

  const errorResponse: ErrorResponse = {
    error: `API request failed: ${response.status} ${response.statusText}`,
    details: errorText,
  };

  return NextResponse.json(errorResponse, { status: response.status });
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
 * POST /api/gemini/generate
 * 代理 Gemini API 调用（服务端）
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 获取并验证 API Key
    const apiKey = getApiKey();

    // 解析并验证请求体
    let body: unknown;
    try {
      body = await req.json();
    } catch (error) {
      return createErrorResponse(
        "Invalid request: failed to parse JSON body",
        400
      );
    }

    validateRequest(body);

    // 构建请求体
    const requestBody: GeminiRequest = {
      contents: body.contents,
      ...(body.generationConfig && { generationConfig: body.generationConfig }),
    };

    console.log("[Gemini API] Sending request:", {
      url: API_BASE_URL,
      timeout: `${REQUEST_TIMEOUT_MS}ms`,
      contentsCount: requestBody.contents.length,
      hasGenerationConfig: !!requestBody.generationConfig,
    });

    // 发送请求
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

    console.log("[Gemini API] Response received:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    // 处理错误响应
    if (!response.ok) {
      return await handleErrorResponse(response, requestBody);
    }

    // 返回成功响应
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleError(error);
  }
}
