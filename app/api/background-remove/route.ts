import { NextRequest, NextResponse } from "next/server";

/**
 * 背景移除 API 代理
 * 调用外部背景移除服务
 * POST /api/background-remove
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const refineForeground = formData.get("refine_foreground") || "false";

    if (!image) {
      return NextResponse.json(
        { error: "Missing image file" },
        { status: 400 }
      );
    }

    // 创建新的 FormData 转发给外部 API
    const externalFormData = new FormData();
    externalFormData.append("image", image);
    externalFormData.append("refine_foreground", refineForeground as string);

    // 调用外部背景移除 API（Django 需要 URL 以斜杠结尾）
    const response = await fetch(
      "https://www.zhimazhe.com/api/ip/background-remove/",
      {
        method: "POST",
        body: externalFormData,
      }
    );

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

    // 获取返回的图片
    const contentType = response.headers.get("content-type");
    console.log("外部抠图 API 返回的 Content-Type:", contentType);
    console.log("外部抠图 API 响应状态:", response.status, response.statusText);

    if (contentType && contentType.startsWith("image/")) {
      // 返回的是图片，直接转发
      const imageBlob = await response.blob();
      console.log("外部抠图 API 返回的图片 Blob:", {
        size: imageBlob.size,
        type: imageBlob.type,
      });

      return new NextResponse(imageBlob, {
        status: 200,
        headers: {
          "Content-Type": contentType,
        },
      });
    } else {
      // 可能是 JSON 格式的响应
      const result = await response.json();
      console.log("外部抠图 API 返回的 JSON 数据:", result);

      return NextResponse.json({
        success: true,
        data: result,
      });
    }
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
