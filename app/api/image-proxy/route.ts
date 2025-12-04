import { NextRequest, NextResponse } from "next/server";

/**
 * 图片代理 API
 * 用于解决云存储图片的 CORS 问题
 */
export async function GET(request: NextRequest) {
  // 处理 OPTIONS 预检请求
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing url parameter" },
        { status: 400 }
      );
    }

    // 验证 URL 是否是云存储地址（安全措施）
    if (
      !imageUrl.includes("tcb.qcloud.la") &&
      !imageUrl.includes("cloudbase")
    ) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    // 使用原生 fetch 获取图片（避免 axios 的编码问题）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 分钟超时

    let response: Response;
    try {
      response = await fetch(imageUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "image/*,*/*",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error("Request timeout after 180000ms");
      }
      throw error;
    }

    if (!response.ok) {
      console.error("[Image Proxy] Failed to fetch image:", {
        status: response.status,
        statusText: response.statusText,
        url: imageUrl,
      });
      return NextResponse.json(
        {
          error: "Failed to fetch image",
          status: response.status,
          statusText: response.statusText,
        },
        { status: response.status }
      );
    }

    // 获取图片数据
    let imageBuffer: ArrayBuffer | Buffer;
    try {
      // 尝试获取 ArrayBuffer
      imageBuffer = await response.arrayBuffer();
    } catch (error) {
      console.error("[Image Proxy] Failed to read image buffer:", error);
      return NextResponse.json(
        { error: "Failed to read image data" },
        { status: 500 }
      );
    }

    // 验证图片数据不为空
    const bufferLength =
      imageBuffer instanceof ArrayBuffer
        ? imageBuffer.byteLength
        : (imageBuffer as Buffer).length;

    if (!imageBuffer || bufferLength === 0) {
      console.error("[Image Proxy] Empty image buffer");
      return NextResponse.json({ error: "Empty image data" }, { status: 500 });
    }

    const contentType = response.headers.get("content-type") || "image/png";

    // 如果是 Buffer，转换为 ArrayBuffer
    let finalBuffer: ArrayBuffer;
    if (imageBuffer instanceof ArrayBuffer) {
      finalBuffer = imageBuffer;
    } else {
      // Node.js Buffer 转换为 ArrayBuffer
      const buffer = imageBuffer as Buffer;
      finalBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      ) as ArrayBuffer;
    }

    // 返回图片，并设置 CORS 头
    return new NextResponse(finalBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": finalBuffer.byteLength.toString(),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Image proxy error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
