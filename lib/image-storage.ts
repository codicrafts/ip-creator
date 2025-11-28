/**
 * 图片本地存储工具
 * 用于在 edit 页面持久化 sourceImage，避免刷新后丢失
 */

const SOURCE_IMAGE_KEY = 'ip_creative_source_image';
const SOURCE_IMAGE_MIME_TYPE_KEY = 'ip_creative_source_image_mime_type';

/**
 * 保存源图片到 localStorage
 */
export const saveSourceImage = (image: string, mimeType: string) => {
  try {
    localStorage.setItem(SOURCE_IMAGE_KEY, image);
    localStorage.setItem(SOURCE_IMAGE_MIME_TYPE_KEY, mimeType);
  } catch (error) {
    console.error('Failed to save source image to localStorage:', error);
    // 如果存储失败（可能是存储空间不足），尝试清理旧数据
    try {
      localStorage.removeItem(SOURCE_IMAGE_KEY);
      localStorage.removeItem(SOURCE_IMAGE_MIME_TYPE_KEY);
      localStorage.setItem(SOURCE_IMAGE_KEY, image);
      localStorage.setItem(SOURCE_IMAGE_MIME_TYPE_KEY, mimeType);
    } catch (retryError) {
      console.error('Failed to save source image after cleanup:', retryError);
    }
  }
};

/**
 * 从 localStorage 加载源图片
 */
export const loadSourceImage = (): { image: string; mimeType: string } | null => {
  try {
    const image = localStorage.getItem(SOURCE_IMAGE_KEY);
    const mimeType = localStorage.getItem(SOURCE_IMAGE_MIME_TYPE_KEY);
    if (image && mimeType) {
      return { image, mimeType };
    }
  } catch (error) {
    console.error('Failed to load source image from localStorage:', error);
  }
  return null;
};

/**
 * 清除源图片
 */
export const clearSourceImage = () => {
  try {
    localStorage.removeItem(SOURCE_IMAGE_KEY);
    localStorage.removeItem(SOURCE_IMAGE_MIME_TYPE_KEY);
  } catch (error) {
    console.error('Failed to clear source image from localStorage:', error);
  }
};

/**
 * 将云存储 URL 转换为代理 URL（解决 CORS 问题）
 * @param url 原始图片 URL
 * @returns 代理 URL 或原始 URL（如果不是云存储 URL）
 */
export const getProxiedImageUrl = (url: string): string => {
  // 如果是 base64 数据 URL，直接返回
  if (url.startsWith('data:')) {
    return url;
  }

  // 如果是云存储 URL，使用代理
  if (url.includes('tcb.qcloud.la') || url.includes('cloudbase')) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }

  // 其他 URL 直接返回
  return url;
};

