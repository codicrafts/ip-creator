/**
 * 资源库本地存储工具
 * 用于存储用户上传的资源图片
 */

import { LibraryResource } from "@/types";

const LIBRARY_RESOURCES_KEY = "ip_creative_library_resources";
const MAX_RESOURCES = 100; // 最多存储 100 个资源

/**
 * 保存资源到 localStorage
 */
export const saveLibraryResource = (
  resource: Omit<LibraryResource, "id" | "timestamp">
): LibraryResource => {
  try {
    const resources = getLibraryResources();
    
    // 如果超过最大数量，删除最旧的资源
    if (resources.length >= MAX_RESOURCES) {
      resources.sort((a, b) => a.timestamp - b.timestamp);
      resources.splice(0, resources.length - MAX_RESOURCES + 1);
    }

    const newResource: LibraryResource = {
      id: `resource-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: Date.now(),
      ...resource,
    };

    resources.push(newResource);
    localStorage.setItem(LIBRARY_RESOURCES_KEY, JSON.stringify(resources));
    
    return newResource;
  } catch (error) {
    console.error("Failed to save library resource:", error);
    // 如果存储失败，尝试清理旧数据
    try {
      const resources = getLibraryResources();
      // 只保留最新的 50 个资源
      resources.sort((a, b) => b.timestamp - a.timestamp);
      const limitedResources = resources.slice(0, 50);
      localStorage.setItem(
        LIBRARY_RESOURCES_KEY,
        JSON.stringify(limitedResources)
      );
      
      // 重新尝试保存
      const newResource: LibraryResource = {
        id: `resource-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        timestamp: Date.now(),
        ...resource,
      };
      limitedResources.push(newResource);
      localStorage.setItem(
        LIBRARY_RESOURCES_KEY,
        JSON.stringify(limitedResources)
      );
      return newResource;
    } catch (retryError) {
      console.error("Failed to save library resource after cleanup:", retryError);
      throw retryError;
    }
  }
};

/**
 * 从 localStorage 加载所有资源
 */
export const getLibraryResources = (): LibraryResource[] => {
  try {
    const data = localStorage.getItem(LIBRARY_RESOURCES_KEY);
    if (data) {
      const resources = JSON.parse(data) as LibraryResource[];
      // 按时间倒序排列（最新的在前）
      return resources.sort((a, b) => b.timestamp - a.timestamp);
    }
  } catch (error) {
    console.error("Failed to load library resources:", error);
  }
  return [];
};

/**
 * 根据 ID 获取资源
 */
export const getLibraryResource = (id: string): LibraryResource | null => {
  const resources = getLibraryResources();
  return resources.find((r) => r.id === id) || null;
};

/**
 * 删除资源
 */
export const deleteLibraryResource = (id: string): boolean => {
  try {
    const resources = getLibraryResources();
    const filtered = resources.filter((r) => r.id !== id);
    localStorage.setItem(LIBRARY_RESOURCES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Failed to delete library resource:", error);
    return false;
  }
};

/**
 * 批量删除资源
 */
export const deleteLibraryResources = (ids: string[]): boolean => {
  try {
    const resources = getLibraryResources();
    const filtered = resources.filter((r) => !ids.includes(r.id));
    localStorage.setItem(LIBRARY_RESOURCES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Failed to delete library resources:", error);
    return false;
  }
};

/**
 * 清空所有资源
 */
export const clearLibraryResources = (): boolean => {
  try {
    localStorage.removeItem(LIBRARY_RESOURCES_KEY);
    return true;
  } catch (error) {
    console.error("Failed to clear library resources:", error);
    return false;
  }
};

/**
 * 更新资源名称
 */
export const updateLibraryResourceName = (
  id: string,
  name: string
): boolean => {
  try {
    const resources = getLibraryResources();
    const resource = resources.find((r) => r.id === id);
    if (resource) {
      resource.name = name;
      localStorage.setItem(LIBRARY_RESOURCES_KEY, JSON.stringify(resources));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to update library resource name:", error);
    return false;
  }
};

