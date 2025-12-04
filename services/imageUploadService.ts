/**
 * 图片上传服务
 * 用于将 base64 图片上传到微信云存储
 */

import { callCloudFunction } from "@/lib/cloud";

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
    const result = await callCloudFunction("uploadImage", {
      base64Data,
      fileName,
      mimeType,
    });

    if (result.success !== 1) {
      console.error("Failed to upload image:", result.message);
      return null;
    }

    const data = result.data as { url: string; fileId: string };
    return {
      url: data?.url || "",
      fileId: data?.fileId || "",
    };
  } catch (error) {
    console.error("Upload image error:", error);
    return null;
  }
};

/**
 * 批量上传图片到云存储
 * @param images 图片数组，每个元素包含 base64Data, fileName?, mimeType?
 * @returns 包含每个图片上传结果的数组
 */
export const batchUploadImagesToCloud = async (
  images: Array<{
    base64Data: string;
    fileName?: string;
    mimeType?: string;
    index: number;
  }>
): Promise<
  Array<{ index: number; url?: string; fileId?: string; error?: string }>
> => {
  try {
    // 调用批量上传接口
    const result = await callCloudFunction("uploadImage", {
      images,
    });

    if (result.success !== 1) {
      console.error("Failed to batch upload images:", result.message);
      return images.map((img) => ({
        index: img.index,
        error: result.message || "Batch upload failed",
      }));
    }

    // 映射返回结果
    const uploadResults = result.data as Array<{
      success: boolean;
      data?: { url: string; fileId: string; fileName: string };
      error?: string;
      index: number;
    }>;

    return uploadResults.map((res) => {
      if (res.success && res.data) {
        return {
          index: res.index,
          url: res.data.url,
          fileId: res.data.fileId,
        };
      } else {
        return {
          index: res.index,
          error: res.error || "Upload failed",
        };
      }
    });
  } catch (error) {
    console.error("Batch upload images error:", error);
    // 如果整个过程出错，返回所有失败
    return images.map((img) => ({
      index: img.index,
      error: "Batch upload failed",
    }));
  }
};

/**
 * 根据 fileID 获取图片临时链接（用于刷新过期的链接）
 * @param fileId 云存储文件ID
 * @returns 临时链接
 */
export const getImageUrl = async (fileId: string): Promise<string | null> => {
  try {
    const result = await callCloudFunction("getImageUrl", {
      fileId,
    });

    if (result.success !== 1) {
      console.error("Failed to get image URL:", result.message);
      return null;
    }

    const data = result.data as { url: string };
    return data?.url || null;
  } catch (error) {
    console.error("Get image URL error:", error);
    return null;
  }
};
