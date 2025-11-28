/**
 * 图片上传服务
 * 用于将 base64 图片上传到微信云存储
 */

import { callCloudFunction } from '@/lib/cloud';

/**
 * 上传 base64 图片到云存储
 * @param base64Data base64 图片数据（可以包含 data:image/xxx;base64, 前缀）
 * @param fileName 可选的文件名
 * @param mimeType 可选的 MIME 类型
 * @returns 云存储文件链接和 fileID
 */
export const uploadImageToCloud = async (
  base64Data: string,
  fileName?: string,
  mimeType?: string
): Promise<{ url: string; fileId: string } | null> => {
  try {
    const result = await callCloudFunction('uploadImage', {
      base64Data,
      fileName,
      mimeType,
    });

    if (result.success !== 1) {
      console.error('Failed to upload image:', result.message);
      return null;
    }

    return {
      url: result.data?.url || '',
      fileId: result.data?.fileId || '',
    };
  } catch (error) {
    console.error('Upload image error:', error);
    return null;
  }
};

/**
 * 根据 fileID 获取图片临时链接（用于刷新过期的链接）
 * @param fileId 云存储文件ID
 * @returns 临时链接
 */
export const getImageUrl = async (fileId: string): Promise<string | null> => {
  try {
    const result = await callCloudFunction('getImageUrl', {
      fileId,
    });

    if (result.success !== 1) {
      console.error('Failed to get image URL:', result.message);
      return null;
    }

    return result.data?.url || null;
  } catch (error) {
    console.error('Get image URL error:', error);
    return null;
  }
};

