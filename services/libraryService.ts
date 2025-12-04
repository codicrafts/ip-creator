/**
 * 资源库服务
 * 用于管理用户上传的资源图片（存储到云存储和数据库）
 */

import { callCloudFunction } from "@/lib/cloud";
import { LibraryResource } from "@/types";

/**
 * 保存资源到云存储和数据库
 */
export const saveLibraryResource = async (
  resource: Omit<LibraryResource, "id" | "timestamp">,
  userId?: string
): Promise<LibraryResource | null> => {
  try {
    const result = await callCloudFunction("library", {
      action: "save",
      userId: userId || null,
      name: resource.name,
      url: resource.url,
      fileId: resource.fileId,
      mimeType: resource.mimeType,
      fileSize: resource.fileSize,
    });

    if (result.success !== 1) {
      console.error("Failed to save library resource:", result.message);
      return null;
    }

    return result.data as LibraryResource;
  } catch (error) {
    console.error("Save library resource error:", error);
    return null;
  }
};

/**
 * 获取用户的资源列表
 */
export const getLibraryResources = async (
  userId?: string
): Promise<LibraryResource[]> => {
  try {
    const result = await callCloudFunction("library", {
      action: "getList",
      userId: userId || null,
    });

    if (result.success !== 1) {
      console.error("Failed to get library resources:", result.message);
      return [];
    }

    // 处理不同的返回格式
    if (
      result.data &&
      typeof result.data === "object" &&
      !Array.isArray(result.data)
    ) {
      const dataObj = result.data as { resources?: LibraryResource[] };
      if (dataObj.resources && Array.isArray(dataObj.resources)) {
        return dataObj.resources;
      }
    }

    if (Array.isArray(result.data)) {
      return result.data as LibraryResource[];
    }

    return [];
  } catch (error) {
    console.error("Get library resources error:", error);
    return [];
  }
};

/**
 * 删除资源
 */
export const deleteLibraryResource = async (
  resourceId: string,
  userId?: string
): Promise<boolean> => {
  try {
    const result = await callCloudFunction("library", {
      action: "delete",
      resourceId,
      userId: userId || null,
    });

    if (result.success !== 1) {
      console.error("Failed to delete library resource:", result.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete library resource error:", error);
    return false;
  }
};

/**
 * 批量删除资源
 */
export const deleteLibraryResources = async (
  resourceIds: string[],
  userId?: string
): Promise<boolean> => {
  try {
    const result = await callCloudFunction("library", {
      action: "batchDelete",
      resourceIds,
      userId: userId || null,
    });

    if (result.success !== 1) {
      console.error("Failed to delete library resources:", result.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete library resources error:", error);
    return false;
  }
};

/**
 * 更新资源名称
 */
export const updateLibraryResourceName = async (
  resourceId: string,
  name: string,
  userId?: string
): Promise<boolean> => {
  try {
    const result = await callCloudFunction("library", {
      action: "updateName",
      resourceId,
      name,
      userId: userId || null,
    });

    if (result.success !== 1) {
      console.error("Failed to update library resource name:", result.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Update library resource name error:", error);
    return false;
  }
};
