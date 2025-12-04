import { NextRequest, NextResponse } from "next/server";
import {
  fetchWithTimeout,
  validateImageFormat,
  getImageExtension,
  CORS_HEADERS,
} from "@/lib/fetch-utils";

const EXTERNAL_API_URL = "https://www.zhimazhe.com/api/ip/background-remove/";
const REQUEST_TIMEOUT_MS = 180000; // 3 分钟

/**
 * 背景移除 API 代理
 * 调用外部背景移除服务
 * POST /api/remove-background
 */
export async function POST(request: NextRequest) {
  // 处理 OPTIONS 预检请求
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: CORS_HEADERS,
    });
  }
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const imageUrl = formData.get("image_url") as string;
    const refineForeground = formData.get("refine_foreground") || "false";

    // 检查是否有图片文件或图片 URL
    if (!image && !imageUrl) {
      return NextResponse.json(
        { error: "Missing image file or image_url" },
        { status: 400 }
      );
    }

    // 创建新的 FormData 转发给外部 API
    const externalFormData = new FormData();

    if (imageUrl) {
      // 如果提供了 URL，在服务端获取图片
      let imageResponse: Response;
      try {
        imageResponse = await fetchWithTimeout(
          imageUrl,
          {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              Accept: "image/*,*/*",
            },
          },
          REQUEST_TIMEOUT_MS
        );
      } catch (error: any) {
        if (error.message?.includes("timeout")) {
          return NextResponse.json(
            { error: "Request timeout when fetching image from URL" },
            { status: 408 }
          );
        }
        throw error;
      }

      if (!imageResponse.ok) {
        return NextResponse.json(
          {
            error: `Failed to fetch image from URL: ${imageResponse.statusText}`,
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await imageResponse.arrayBuffer();
      const contentType =
        imageResponse.headers.get("content-type") || "image/png";
      const ext = getImageExtension(contentType);
      const blob = new Blob([arrayBuffer], { type: contentType });
      externalFormData.append("image", blob, `image.${ext}`);
    } else if (image) {
      externalFormData.append("image", image);
    }

    externalFormData.append("refine_foreground", refineForeground as string);

    // 调用外部背景移除 API
    let response: Response;
    try {
      response = await fetchWithTimeout(
        EXTERNAL_API_URL,
        {
          method: "POST",
          body: externalFormData,
        },
        REQUEST_TIMEOUT_MS
      );
    } catch (error: any) {
      if (error.message?.includes("timeout")) {
        return NextResponse.json(
          { error: "Background removal request timeout" },
          { status: 408 }
        );
      }
      throw error;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Background removal API error:", errorText);
      return NextResponse.json(
        {
          error: `Background removal failed: ${response.status} ${response.statusText}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.startsWith("image/")) {
      const imageBlob = await response.blob();

      if (!imageBlob || imageBlob.size === 0) {
        return NextResponse.json(
          { error: "Empty image data from background removal API" },
          { status: 500 }
        );
      }

      // 验证图片格式
      const arrayBuffer = await imageBlob.arrayBuffer();
      const { isValid, format } = validateImageFormat(arrayBuffer);

      if (!isValid) {
        console.error("[Remove Background] Invalid image format:", {
          size: imageBlob.size,
          contentType,
        });
        return NextResponse.json(
          { error: "Invalid image data format from background removal API" },
          { status: 500 }
        );
      }

      return new NextResponse(imageBlob, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": imageBlob.size.toString(),
          ...CORS_HEADERS,
        },
      });
    }

    // JSON 格式的响应
    const result = await response.json();
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Background removal proxy error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to remove background",
        details: error.stack,
      },
      { status: 500 }
    );
  }
}
