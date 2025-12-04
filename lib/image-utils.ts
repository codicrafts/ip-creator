/**
 * 图片处理工具函数
 */

// 常量
export const DEFAULT_MAX_WIDTH = 1024;
export const DEFAULT_MAX_HEIGHT = 1024;
export const STICKER_MAX_WIDTH = 2048; // 表情包使用更高分辨率
export const STICKER_MAX_HEIGHT = 2048;
export const IMAGE_QUALITY = 0.9;
export const STICKER_IMAGE_QUALITY = 0.95; // 表情包使用更高质量

/**
 * 从 base64 字符串中提取 MIME 类型
 */
export function extractMimeType(base64Str: string): string {
  if (base64Str.startsWith("data:image/png")) {
    return "image/png";
  }
  if (base64Str.startsWith("data:image/webp")) {
    return "image/webp";
  }
  if (
    base64Str.startsWith("data:image/jpeg") ||
    base64Str.startsWith("data:image/jpg")
  ) {
    return "image/jpeg";
  }
  return "image/jpeg"; // 默认
}

/**
 * 清理 base64 字符串，移除 data URL 前缀
 */
export function cleanBase64(base64Str: string): string {
  return base64Str.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
}

/**
 * 调整图片尺寸（如果超过最大尺寸）
 */
export function resizeImage(
  base64Str: string,
  maxWidth = DEFAULT_MAX_WIDTH,
  maxHeight = DEFAULT_MAX_HEIGHT,
  quality = IMAGE_QUALITY
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let { width, height } = img;

      // 如果尺寸在限制内，直接返回
      if (width <= maxWidth && height <= maxHeight) {
        resolve(base64Str);
        return;
      }

      // 计算新尺寸，保持宽高比
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // 创建 canvas 并绘制
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64Str); // Fallback
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(base64Str); // Fallback
  });
}

/**
 * 调整图片尺寸（专门用于表情包生成，使用更高分辨率）
 */
export function resizeImageForSticker(
  base64Str: string
): Promise<string> {
  return resizeImage(
    base64Str,
    STICKER_MAX_WIDTH,
    STICKER_MAX_HEIGHT,
    STICKER_IMAGE_QUALITY
  );
}

/**
 * 将图片 URL 转换为 base64
 */
export function urlToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("无法创建 canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);

      // 根据 URL 确定输出格式
      let mimeType = "image/jpeg";
      if (url.includes(".png") || url.includes("image/png")) {
        mimeType = "image/png";
      } else if (url.includes(".webp") || url.includes("image/webp")) {
        mimeType = "image/webp";
      }

      const base64 = canvas.toDataURL(mimeType, IMAGE_QUALITY);
      resolve(base64);
    };
    img.onerror = (error) => {
      reject(new Error(`加载图片失败: ${error}`));
    };
  });
}

/**
 * 检查是否为 URL
 */
export function isUrl(str: string): boolean {
  return str.startsWith("http://") || str.startsWith("https://");
}

/**
 * 获取代理 URL（如果需要）
 */
export function getProxiedUrl(url: string): string {
  if (
    url.includes("tcb.qcloud.la") ||
    url.includes("cloudbase")
  ) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

