import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  "https://api.laozhang.ai/v1beta/models/gemini-3-pro-image-preview:generateContent";

/**
 * POST /api/gemini/generate
 * 代理 Gemini API 调用（服务端）
 */
export async function POST(request: NextRequest) {
  try {
    const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: "API_KEY is not set" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { contents, generationConfig } = body;

    // 验证请求体
    if (!contents || !Array.isArray(contents) || contents.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: contents is required and must be an array" },
        { status: 400 }
      );
    }

    // 构建请求体
    const requestBody: any = {
      contents,
    };

    if (generationConfig) {
      requestBody.generationConfig = generationConfig;
    }

    // 验证 API_KEY 格式
    if (!API_KEY || API_KEY.trim().length === 0) {
      return NextResponse.json(
        { error: "API_KEY is empty or invalid" },
        { status: 500 }
      );
    }

    // 尝试发送请求
    let response: Response;
    try {
      response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY.trim()}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });
    } catch (fetchError: any) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { error: `Network error: ${fetchError.message}` },
        { status: 500 }
      );
    }

    if (!response.ok) {
      let errorText: string;
      let errorData: any;
      try {
        errorData = await response.json();
        errorText = JSON.stringify(errorData, null, 2);
        console.error("Gemini API Error Response:", errorData);
        console.error(
          "Request body (generationConfig):",
          JSON.stringify(requestBody.generationConfig, null, 2)
        );
      } catch {
        errorText = await response.text();
        console.error("Gemini API Error Response (text):", errorText);
      }

      return NextResponse.json(
        {
          error: `API request failed: ${response.status} ${response.statusText}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
