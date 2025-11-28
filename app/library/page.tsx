"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Upload,
  X,
  Edit2,
  Check,
  Image as ImageIcon,
  Sparkles,
  Smile,
  Trash2,
} from "lucide-react";
import TabBarWrapper from "@/app/components/TabBarWrapper";
import {
  getLibraryResources,
  saveLibraryResource,
  deleteLibraryResource,
  deleteLibraryResources,
  updateLibraryResourceName,
} from "@/services/libraryService";
import { uploadImageToCloud } from "@/services/imageUploadService";
import { getProxiedImageUrl } from "@/lib/image-storage";
import { clearSceneDrafts } from "@/lib/scene-storage";
import {
  setSourceImage,
  setSceneDrafts,
  setActiveSceneDraftIndex,
} from "@/store/slices/imageSlice";
import { setMemeDrafts, setActiveDraftIndex } from "@/store/slices/memeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AnimationType, LibraryResource } from "@/types";
import Loader from "@/components/Loader";
import ConfirmModal from "@/components/ConfirmModal";

export default function LibraryPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.userId);
  const userStatus = useAppSelector((state) => state.user.status);
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isBatchDeleteConfirmOpen, setIsBatchDeleteConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 加载资源
  useEffect(() => {
    loadResources();
  }, [userId, userStatus]);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const loaded = await getLibraryResources(
        userStatus === "LOGGED_IN" && userId ? userId : undefined
      );
      setResources(loaded);
    } catch (error) {
      console.error("Failed to load resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理文件上传
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert("文件大小不能超过 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // 读取文件为 base64
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 上传到云存储
      const uploadResult = await uploadImageToCloud(
        imageData,
        `library/${Date.now()}-${file.name}`,
        file.type
      );

      if (!uploadResult) {
        alert("上传失败，请重试");
        return;
      }

      // 保存资源信息到数据库
      const resource = await saveLibraryResource(
        {
          name: file.name.replace(/\.[^/.]+$/, ""), // 移除扩展名
          url: uploadResult.url,
          fileId: uploadResult.fileId,
          mimeType: file.type,
          fileSize: file.size,
        },
        userStatus === "LOGGED_IN" && userId ? userId : undefined
      );

      if (resource) {
        await loadResources();
      } else {
        alert("保存资源失败，请重试");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("上传失败，请重试");
    } finally {
      setIsUploading(false);
      // 重置 input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 删除资源
  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      const success = await deleteLibraryResource(
        pendingDeleteId,
        userStatus === "LOGGED_IN" && userId ? userId : undefined
      );
      if (success) {
        await loadResources();
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== pendingDeleteId));
      } else {
        alert("删除失败，请重试");
      }
    } catch (error) {
      console.error("Failed to delete resource:", error);
      alert("删除失败，请重试");
    } finally {
      setIsDeleteConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    setIsBatchDeleteConfirmOpen(true);
  };

  const confirmBatchDelete = async () => {
    try {
      const success = await deleteLibraryResources(
        selectedIds,
        userStatus === "LOGGED_IN" && userId ? userId : undefined
      );
      if (success) {
        await loadResources();
        setSelectedIds([]);
        setIsSelectionMode(false);
      } else {
        alert("删除失败，请重试");
      }
    } catch (error) {
      console.error("Failed to delete resources:", error);
      alert("删除失败，请重试");
    } finally {
      setIsBatchDeleteConfirmOpen(false);
    }
  };

  // 切换选择模式
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  // 切换资源选择
  const toggleResourceSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // 开始编辑名称
  const startEditName = (resource: LibraryResource) => {
    setEditingId(resource.id);
    setEditingName(resource.name);
  };

  // 保存编辑的名称
  const saveEditName = async (id: string) => {
    if (editingName.trim()) {
      const success = await updateLibraryResourceName(
        id,
        editingName.trim(),
        userStatus === "LOGGED_IN" && userId ? userId : undefined
      );
      if (success) {
        await loadResources();
      } else {
        alert("更新失败，请重试");
      }
    }
    setEditingId(null);
    setEditingName("");
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  // 使用资源进行场景扩展
  const handleUseForScene = (resource: LibraryResource) => {
    // 先清除 localStorage 和 Redux 中的旧数据，避免混合
    clearSceneDrafts();
    dispatch(setSceneDrafts([]));

    // 创建单个场景扩展草稿（和表情包逻辑一致）
    const sceneDraft = {
      id: `scene-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      sourceUrl: resource.url,
      sourceMimeType: resource.mimeType,
      generatedUrl: null,
      prompt: "",
      style: undefined,
      status: "pending" as const,
    };

    dispatch(setSceneDrafts([sceneDraft]));
    dispatch(setActiveSceneDraftIndex(0));
    router.push("/edit");
  };

  // 使用资源进行表情包制作
  const handleUseForMeme = (resource: LibraryResource) => {
    const memeDraft = {
      id: `meme-${Date.now()}`,
      sourceUrl: resource.url,
      generatedUrl: null,
      text: "",
      moodPrompt: "",
      status: "pending" as const,
      animation: AnimationType.NONE,
      backgroundType: "transparent" as const,
      backgroundColor: "#FFFFFF",
      removeBackground: true,
      refineForeground: false,
    };
    dispatch(setMemeDrafts([memeDraft]));
    dispatch(setActiveDraftIndex(0));
    router.push("/meme-editor");
  };

  // 批量使用资源进行场景扩展
  const handleBatchUseForScene = () => {
    if (selectedIds.length === 0) return;
    const selectedResources = resources.filter((r) =>
      selectedIds.includes(r.id)
    );
    if (selectedResources.length > 0) {
      // 先清除 localStorage 和 Redux 中的旧数据，避免混合
      clearSceneDrafts();
      dispatch(setSceneDrafts([]));

      // 创建多个场景扩展草稿
      const sceneDrafts = selectedResources.map((resource, index) => ({
        id: `scene-${Date.now()}-${index}-${Math.random()
          .toString(36)
          .substring(7)}`,
        sourceUrl: resource.url,
        sourceMimeType: resource.mimeType,
        generatedUrl: null,
        prompt: "",
        style: undefined,
        status: "pending" as const,
      }));

      // 设置新的 sceneDrafts
      dispatch(setSceneDrafts(sceneDrafts));
      dispatch(setActiveSceneDraftIndex(0));
      router.push("/edit");
    }
  };

  // 批量使用资源进行表情包制作
  const handleBatchUseForMeme = () => {
    if (selectedIds.length === 0) return;
    const selectedResources = resources.filter((r) =>
      selectedIds.includes(r.id)
    );
    if (selectedResources.length > 0) {
      const memeDrafts = selectedResources.map((resource) => ({
        id: `meme-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        sourceUrl: resource.url,
        generatedUrl: null,
        text: "",
        moodPrompt: "",
        status: "pending" as const,
        animation: AnimationType.NONE,
        backgroundType: "transparent" as const,
        backgroundColor: "#FFFFFF",
        removeBackground: true,
        refineForeground: false,
      }));
      dispatch(setMemeDrafts(memeDrafts));
      dispatch(setActiveDraftIndex(0));
      router.push("/meme-editor");
    }
  };

  return (
    <TabBarWrapper>
      <div className="flex flex-col min-h-screen bg-gray-50 pb-24 md:pt-16">
        {/* Header */}
        <header className="bg-white px-4 md:hidden py-3 sticky top-0 z-10 shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-800">资源库</h1>
            <div className="flex items-center gap-2">
              {isSelectionMode ? (
                <>
                  <button
                    onClick={handleBatchDelete}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={selectedIds.length === 0}
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={toggleSelectionMode}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                </>
              ) : (
                <>
                  {resources.length > 0 && (
                    <button
                      onClick={toggleSelectionMode}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      选择
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </header>

        {/* PC Header */}
        <header className="hidden md:flex bg-white px-8 py-4 border-b border-gray-100 items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">资源库</h1>
          <div className="flex items-center gap-2">
            {isSelectionMode ? (
              <>
                <button
                  onClick={handleBatchDelete}
                  className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={selectedIds.length === 0}
                >
                  删除选中 ({selectedIds.length})
                </button>
                <button
                  onClick={toggleSelectionMode}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  取消
                </button>
              </>
            ) : (
              <>
                {resources.length > 0 && (
                  <button
                    onClick={toggleSelectionMode}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    选择
                  </button>
                )}
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {/* 上传区域 */}
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`bg-white border-2 border-dashed border-violet-200 rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center space-y-4 transition-all mb-6 ${
              isUploading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-violet-50 hover:border-violet-400"
            }`}
          >
            <div className="bg-violet-100 p-4 rounded-full">
              {isUploading ? (
                <Loader />
              ) : (
                <Upload size={32} className="text-violet-600" />
              )}
            </div>
            <div className="text-center space-y-2">
              <p className="font-semibold text-gray-700">
                {isUploading ? "上传中..." : "上传资源图片"}
              </p>
              <p className="text-xs text-gray-400">支持 JPG, PNG (最大 5MB)</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>

          {/* 资源列表 */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                还没有资源，上传一些图片开始使用吧
              </p>
            </div>
          ) : (
            <>
              {/* 批量操作栏 */}
              {isSelectionMode && selectedIds.length > 0 && (
                <div className="fixed bottom-20 left-0 right-0 bg-violet-600 text-white p-4 md:bottom-4 md:left-auto md:right-4 md:rounded-2xl md:max-w-md md:shadow-lg z-40">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">
                      已选择 {selectedIds.length} 个资源
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleBatchUseForScene}
                        className="px-3 py-1.5 bg-white text-violet-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-1"
                      >
                        <Sparkles size={14} />
                        场景扩展
                      </button>
                      <button
                        onClick={handleBatchUseForMeme}
                        className="px-3 py-1.5 bg-white text-violet-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-1"
                      >
                        <Smile size={14} />
                        表情包
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className={`
                      bg-white rounded-xl overflow-hidden shadow-sm border flex flex-col transition-all group relative
                      ${
                        isSelectionMode && selectedIds.includes(resource.id)
                          ? "border-violet-500 ring-2 ring-violet-200"
                          : "border-gray-100"
                      }
                    `}
                  >
                    {/* 选择框 */}
                    {isSelectionMode && (
                      <div
                        className="absolute top-2 left-2 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleResourceSelection(resource.id);
                        }}
                      >
                        <div
                          className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all
                            ${
                              selectedIds.includes(resource.id)
                                ? "bg-violet-600 border-violet-600"
                                : "bg-white border-gray-300"
                            }
                          `}
                        >
                          {selectedIds.includes(resource.id) && (
                            <Check size={16} className="text-white" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* 图片 */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={getProxiedImageUrl(resource.url)}
                        alt={resource.name}
                        className="w-full h-full object-cover"
                      />
                      {!isSelectionMode && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUseForScene(resource);
                              }}
                              className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                              title="场景扩展"
                            >
                              <Sparkles size={18} className="text-violet-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUseForMeme(resource);
                              }}
                              className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                              title="表情包制作"
                            >
                              <Smile size={18} className="text-violet-600" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 资源名称 */}
                    <div className="p-3">
                      {editingId === resource.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={() => saveEditName(resource.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveEditName(resource.id);
                              } else if (e.key === "Escape") {
                                cancelEdit();
                              }
                            }}
                            className="flex-1 text-sm border border-violet-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEditName(resource.id)}
                            className="p-1 text-violet-600 hover:bg-violet-50 rounded"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className="text-sm font-medium text-gray-800 truncate flex-1"
                            title={resource.name}
                          >
                            {resource.name}
                          </p>
                          {!isSelectionMode && (
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditName(resource);
                                }}
                                className="p-1 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
                                title="重命名"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(resource.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="删除"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 单个删除确认弹框 */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={confirmDelete}
        title="确认删除"
        message="确定要删除这个资源吗？删除后无法恢复。"
        confirmText="删除"
        cancelText="取消"
        confirmColor="red"
      />

      {/* 批量删除确认弹框 */}
      <ConfirmModal
        isOpen={isBatchDeleteConfirmOpen}
        onClose={() => setIsBatchDeleteConfirmOpen(false)}
        onConfirm={confirmBatchDelete}
        title="确认删除"
        message={`确定要删除选中的 ${selectedIds.length} 个资源吗？删除后无法恢复。`}
        confirmText="删除"
        cancelText="取消"
        confirmColor="red"
      />
    </TabBarWrapper>
  );
}
