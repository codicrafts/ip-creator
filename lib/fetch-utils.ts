/**
 * Fetch 工具函数
 */

/**
 * 使用原生 fetch 发送请求，支持超时控制
 * @param url 请求 URL
 * @param options fetch 选项
 * @param timeoutMs 超时时间（毫秒）
 * @returns Promise<Response>
 * @throws {Error} 超时或其他错误
 */
export async function fetchWithTimeout(
  url: string | URL | Request,
  options: RequestInit = {},
  timeoutMs: number = 180000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

/**
 * 将 Blob 转换为 base64 data URL
 * @param blob 要转换的 Blob
 * @returns Promise<string> base64 data URL
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (!result || !result.startsWith("data:")) {
        reject(new Error("Invalid data URL format"));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => {
      reject(new Error("Failed to read blob as data URL"));
    };
    reader.readAsDataURL(blob);
  });
}

/**
 * 验证图片格式是否有效
 * @param arrayBuffer 图片数据的 ArrayBuffer
 * @returns { isValid: boolean; format: string | null }
 */
export function validateImageFormat(
  arrayBuffer: ArrayBuffer
): { isValid: boolean; format: string | null } {
  const uint8Array = new Uint8Array(arrayBuffer);

  // PNG 文件头: 89 50 4E 47 0D 0A 1A 0A
  const isPNG =
    uint8Array[0] === 0x89 &&
    uint8Array[1] === 0x50 &&
    uint8Array[2] === 0x4e &&
    uint8Array[3] === 0x47;

  // JPEG 文件头: FF D8 FF
  const isJPEG =
    uint8Array[0] === 0xff &&
    uint8Array[1] === 0xd8 &&
    uint8Array[2] === 0xff;

  // WebP 文件头: 52 49 46 46 (RIFF)
  const isWebP =
    uint8Array[0] === 0x52 &&
    uint8Array[1] === 0x49 &&
    uint8Array[2] === 0x46 &&
    uint8Array[3] === 0x46;

  if (isPNG) return { isValid: true, format: "PNG" };
  if (isJPEG) return { isValid: true, format: "JPEG" };
  if (isWebP) return { isValid: true, format: "WebP" };

  return { isValid: false, format: null };
}

/**
 * 获取图片文件扩展名
 * @param contentType Content-Type 头
 * @returns 文件扩展名
 */
export function getImageExtension(contentType: string | null): string {
  if (!contentType) return "png";

  if (contentType.includes("jpeg") || contentType.includes("jpg")) {
    return "jpg";
  }
  if (contentType.includes("webp")) {
    return "webp";
  }
  return "png";
}

/**
 * CORS 响应头
 */
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

