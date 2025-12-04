import { fetchWithTimeout, blobToDataURL } from "@/lib/fetch-utils";

const API_ENDPOINT = "/api/remove-background";
const REQUEST_TIMEOUT_MS = 180000; // 3 分钟

export class BackgroundRemovalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BackgroundRemovalError";
  }
}

/**
 * 处理 API 响应，将 Blob 转换为 base64 data URL
 */
async function handleImageResponse(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type");

  if (contentType?.startsWith("image/")) {
    const blob = await response.blob();
    if (!blob || blob.size === 0) {
      throw new BackgroundRemovalError("返回的图片数据为空");
    }
    return blobToDataURL(blob);
  }

  // JSON 格式的响应
  const result = await response.json();
  const imageData = result.image || result.data?.image;
  if (!imageData) {
    throw new BackgroundRemovalError(
      "Invalid response format from background removal API"
    );
  }
  return imageData;
}

/**
 * 将 base64 字符串转换为 Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  // 提取 base64 数据部分
  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;

  // 清理空白字符
  const cleanedBase64 = base64Data.trim().replace(/\s/g, "");

  if (!cleanedBase64) {
    throw new BackgroundRemovalError("Empty base64 image data");
  }

  // 解码 base64
  let byteCharacters: string;
  try {
    byteCharacters = atob(cleanedBase64);
  } catch (error) {
    throw new BackgroundRemovalError(
      `Invalid base64 encoding: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  // 转换为 Uint8Array
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: mimeType });
}

/**
 * 使用外部 API 移除图片背景
 * @param base64Image base64 图片数据（可以包含 data:image/xxx;base64, 前缀）或图片 URL
 * @param refineForeground 是否精炼边缘（更高质量，但更慢），默认为 false
 * @returns 移除背景后的 base64 图片（PNG 格式，透明背景）
 * @throws {BackgroundRemovalError} 当背景移除失败时抛出错误
 */
export const removeBackground = async (
  base64Image: string,
  refineForeground: boolean = false
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("refine_foreground", refineForeground ? "true" : "false");

    // 检查是否是 URL（云存储链接）
    if (
      base64Image.startsWith("http://") ||
      base64Image.startsWith("https://")
    ) {
      formData.append("image_url", base64Image);
    } else {
      // 处理 base64 图片数据
      let mimeType = "image/png";
      if (base64Image.startsWith("data:image")) {
        const mimeMatch = base64Image.match(/data:image\/([^;]+)/);
        if (mimeMatch) {
          mimeType = `image/${mimeMatch[1]}`;
        }
      }
      const blob = base64ToBlob(base64Image, mimeType);
      formData.append("image", blob, "image.png");
    }

    // 调用 API
    let response: Response;
    try {
      response = await fetchWithTimeout(
        API_ENDPOINT,
        {
          method: "POST",
          body: formData,
        },
        REQUEST_TIMEOUT_MS
      );
    } catch (error: any) {
      if (error.message?.includes("timeout")) {
        throw new BackgroundRemovalError("Request timeout");
      }
      throw error;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new BackgroundRemovalError(
        `Background removal API failed: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    return handleImageResponse(response);
  } catch (error) {
    if (error instanceof BackgroundRemovalError) {
      throw error;
    }
    console.error("Remove background error:", error);
    throw new BackgroundRemovalError(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
};
