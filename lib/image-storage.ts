/**
 * 图片工具函数
 * 注意：已移除 localStorage 存储功能，因为图片数据太大容易超出存储限制
 * 现在完全依赖 Redux 来管理图片状态
 */

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

