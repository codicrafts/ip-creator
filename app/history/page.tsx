"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Clock,
  ImageIcon,
  Check,
  Square,
  Trash2,
  X,
  Download,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setIsSelectionMode,
  setSelectedHistoryIds,
  toggleHistorySelection,
  setViewingHistoryItem,
} from "@/store/slices/appSlice";
import { removeFromHistory, setHistory } from "@/store/slices/imageSlice";
import { deleteHistory, getHistory } from "@/services/historyService";
import TabBarWrapper from "@/app/components/TabBarWrapper";
import { getProxiedImageUrl } from "@/lib/image-storage";
import ConfirmModal from "@/components/ConfirmModal";
import Loader from "@/components/Loader";

export default function HistoryPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector((state) => state.user.status);
  const userId = useAppSelector((state) => state.user.userId);
  const history = useAppSelector((state) => state.image.history) || [];
  const isSelectionMode = useAppSelector((state) => state.app.isSelectionMode);
  const selectedHistoryIds =
    useAppSelector((state) => state.app.selectedHistoryIds) || [];
  const viewingHistoryItemId = useAppSelector(
    (state) => state.app.viewingHistoryItem
  );

  const viewingHistoryItem = viewingHistoryItemId
    ? history.find((item) => item && item.id === viewingHistoryItemId)
    : null;
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSingleDeleteConfirmOpen, setIsSingleDeleteConfirmOpen] =
    useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});
  const [isViewerImageLoading, setIsViewerImageLoading] = useState(true);

  // 初始化图片加载状态 - 当历史记录加载完成时，初始化所有图片为加载中
  useEffect(() => {
    if (history.length > 0 && !isLoading) {
      const initialStates: Record<string, boolean> = {};
      history.forEach((item) => {
        if (item && item.id && item.url) {
          // 如果图片状态未设置，默认为加载中
          if (imageLoadingStates[item.id] === undefined) {
            initialStates[item.id] = true;
          }
        }
      });
      if (Object.keys(initialStates).length > 0) {
        setImageLoadingStates((prev) => ({ ...prev, ...initialStates }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.length, isLoading]);

  // 当查看的图片变化时，重置加载状态
  useEffect(() => {
    if (viewingHistoryItem) {
      setIsViewerImageLoading(true);
    }
  }, [viewingHistoryItem?.id]);

  // 清理不在列表中的图片的加载状态
  useEffect(() => {
    const currentIds = new Set(history.map((item) => item.id));
    setImageLoadingStates((prev) => {
      const filtered: Record<string, boolean> = {};
      Object.keys(prev).forEach((id) => {
        if (currentIds.has(id)) {
          filtered[id] = prev[id];
        }
      });
      return filtered;
    });
  }, [history]);

  // 加载历史记录
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        // 如果用户已登录，尝试从服务器加载历史记录
        if (userStatus === "LOGGED_IN" && userId) {
          const historyData = await getHistory(userId);

          // 确保数据格式正确（转换为 GeneratedImage 格式）
          const formattedHistory = historyData
            .filter((item: any) => item && item.url) // 过滤掉无效数据
            .map((item: any) => ({
              id:
                item.id || item._id || `history-${Date.now()}-${Math.random()}`,
              url: item.url || "",
              prompt: item.prompt || "",
              timestamp: item.timestamp || Date.now(),
              style: item.style || undefined,
              type: item.type || undefined, // 保留类型字段：'scene' 或 'meme'
            }));

          if (formattedHistory.length > 0) {
            dispatch(setHistory(formattedHistory));
          }
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // 延迟加载，确保 Redux store 已初始化
    const timer = setTimeout(() => {
      loadHistory();
    }, 100);

    return () => clearTimeout(timer);
  }, [userStatus, userId, dispatch]);

  // 批量删除历史记录
  const handleBatchDelete = async () => {
    if (selectedHistoryIds.length === 0) return;
    setIsDeleteConfirmOpen(true);
  };

  const confirmBatchDelete = async () => {
    try {
      // 从数据库批量删除（一次调用）
      if (userStatus === "LOGGED_IN" && userId) {
        const success = await deleteHistory(selectedHistoryIds);
        if (!success) {
          alert("删除失败，请重试");
          setIsDeleteConfirmOpen(false);
          return;
        }
      }

      // 从 Redux 中删除
      selectedHistoryIds.forEach((id) => {
        dispatch(removeFromHistory(id));
      });

      // 清除选择
      dispatch(setIsSelectionMode(false));
      dispatch(setSelectedHistoryIds([]));
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Failed to delete history:", error);
      alert("删除失败，请重试");
      setIsDeleteConfirmOpen(false);
    }
  };

  return (
    <TabBarWrapper>
      <div className="min-h-screen bg-gray-50 pb-24 md:pt-16">
        <div className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h1 className="font-bold text-2xl text-gray-800 flex items-center gap-2">
              <Clock size={24} className="text-violet-500" />
              创作历史
            </h1>
            <div className="flex items-center gap-3">
              {history.length > 0 && !isSelectionMode && (
                <span className="text-xs text-gray-400">
                  共 {history.length} 条
                </span>
              )}
              {history.length > 0 && (
                <button
                  onClick={() => {
                    if (isSelectionMode) {
                      dispatch(setIsSelectionMode(false));
                      dispatch(setSelectedHistoryIds([]));
                    } else {
                      dispatch(setIsSelectionMode(true));
                    }
                  }}
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                    isSelectionMode
                      ? "text-violet-600 bg-violet-50 border border-violet-200"
                      : "text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {isSelectionMode ? "取消" : "多选"}
                </button>
              )}
            </div>
          </div>

          {/* History List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader message="正在加载历史记录..." />
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <ImageIcon size={24} className="text-gray-300" />
              </div>
              <p className="text-sm">暂无作品，去创作你的第一张画吧！</p>
              <button
                onClick={() => router.push("/create")}
                className="text-violet-600 text-sm font-semibold hover:underline"
              >
                立即创作
              </button>
            </div>
          ) : (
            <div
              className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 pb-20"
              style={{ columnFill: "balance" }}
            >
              {history
                .filter((item) => item && item.id && item.url) // 过滤无效数据
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isSelectionMode) {
                        dispatch(toggleHistorySelection(item.id));
                      } else {
                        dispatch(setViewingHistoryItem(item.id));
                      }
                    }}
                    className={`
                      bg-white rounded-2xl overflow-hidden shadow-sm border flex flex-col transition-all cursor-pointer group relative mb-4 md:mb-6 break-inside-avoid
                      ${
                        isSelectionMode && selectedHistoryIds.includes(item.id)
                          ? "border-violet-500 ring-2 ring-violet-200"
                          : "border-gray-100"
                      }
                    `}
                  >
                    <div className="relative bg-linear-to-br from-gray-100 via-gray-50 to-gray-100 overflow-hidden min-h-[200px]">
                      {/* 加载占位符 - 骨架屏效果 */}
                      {imageLoadingStates[item.id] !== false && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-gray-100 via-gray-50 to-gray-100">
                          {/* Shimmer 动画效果 */}
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                          {/* 加载图标 */}
                          <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-10 h-10 border-[3px] border-violet-200 border-t-violet-500 rounded-full animate-spin"></div>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-linear-to-r from-violet-200 via-violet-300 to-violet-200 animate-pulse"
                                style={{ width: "60%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <img
                        src={getProxiedImageUrl(item.url || "")}
                        alt={item.prompt || "History"}
                        loading="lazy"
                        className={`w-full h-auto object-cover group-hover:scale-105 transition-all duration-300 ${
                          imageLoadingStates[item.id] === false
                            ? "opacity-100"
                            : "opacity-0 absolute"
                        }`}
                        onLoad={() => {
                          setImageLoadingStates((prev) => ({
                            ...prev,
                            [item.id]: false,
                          }));
                        }}
                        onError={(e) => {
                          // 图片加载失败时显示占位符
                          setImageLoadingStates((prev) => ({
                            ...prev,
                            [item.id]: false,
                          }));
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle"%3E图片加载失败%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      {isSelectionMode && (
                        <div className="absolute top-2 right-2">
                          {selectedHistoryIds.includes(item.id) ? (
                            <div className="bg-violet-600 text-white rounded-full p-1 shadow-md">
                              <Check size={16} />
                            </div>
                          ) : (
                            <div className="bg-white/80 rounded-full p-1 shadow-sm">
                              <Square size={16} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                      )}
                      {/* 类型标注 */}
                      {(item as any).type && (
                        <div className="absolute top-2 left-2">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-semibold shadow-sm ${
                              (item as any).type === "meme"
                                ? "bg-violet-500 text-white"
                                : "bg-blue-500 text-white"
                            }`}
                          >
                            {(item as any).type === "meme"
                              ? "表情包"
                              : "场景扩展"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-800 font-medium line-clamp-2 mb-1">
                        {item.prompt || "无提示词"}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>
                          {item.timestamp
                            ? new Date(item.timestamp).toLocaleDateString(
                                undefined,
                                { month: "numeric", day: "numeric" }
                              )
                            : "未知日期"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Batch Action Bar */}
          {isSelectionMode && selectedHistoryIds.length > 0 && (
            <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-auto md:max-w-2xl md:w-full md:mx-auto bg-white rounded-2xl shadow-xl shadow-violet-900/10 p-4 border border-violet-100 flex items-center justify-between z-50 animate-in slide-in-from-bottom-4">
              <div className="text-sm font-medium text-gray-600">
                已选{" "}
                <span className="text-violet-600 font-bold">
                  {selectedHistoryIds.length}
                </span>{" "}
                张
              </div>
              <button
                onClick={handleBatchDelete}
                className="bg-red-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} /> 删除
              </button>
            </div>
          )}

          {/* Full Screen History Viewer Modal */}
          {viewingHistoryItem && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <button
                onClick={() => {
                  dispatch(setViewingHistoryItem(null));
                  setIsViewerImageLoading(true);
                }}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <div className="w-full max-w-lg md:max-w-4xl flex flex-col gap-6">
                <div className="relative w-full flex items-center justify-center">
                  {/* 加载占位符 */}
                  {isViewerImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <p className="text-white/60 text-sm">加载中...</p>
                      </div>
                    </div>
                  )}
                  <img
                    src={getProxiedImageUrl(viewingHistoryItem.url)}
                    className={`w-full h-auto max-h-[60vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl shadow-violet-900/20 transition-opacity duration-300 ${
                      isViewerImageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => {
                      setIsViewerImageLoading(false);
                    }}
                    onError={() => {
                      setIsViewerImageLoading(false);
                    }}
                  />
                </div>

                <div className="space-y-4 px-2">
                  {/* 类型标注 */}
                  {(viewingHistoryItem as any).type && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          (viewingHistoryItem as any).type === "meme"
                            ? "bg-violet-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {(viewingHistoryItem as any).type === "meme"
                          ? "表情包"
                          : "场景扩展"}
                      </span>
                    </div>
                  )}
                  <div className="text-white/80 space-y-1">
                    <p className="text-xs text-white/40">提示词</p>
                    <p className="text-sm font-medium">
                      {viewingHistoryItem.prompt}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={viewingHistoryItem.url}
                      download={`history-${viewingHistoryItem.id}.png`}
                      className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <Download size={16} /> 保存
                    </a>
                    <button
                      onClick={() => {
                        setPendingDeleteId(viewingHistoryItem.id);
                        setIsSingleDeleteConfirmOpen(true);
                      }}
                      className="flex-none bg-red-500/10 text-red-400 border border-red-500/20 py-3 px-4 rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 批量删除确认弹框 */}
          <ConfirmModal
            isOpen={isDeleteConfirmOpen}
            onClose={() => setIsDeleteConfirmOpen(false)}
            onConfirm={confirmBatchDelete}
            title="确认删除"
            message={`确定要删除选中的 ${selectedHistoryIds.length} 条历史记录吗？删除后无法恢复。`}
            confirmText="删除"
            cancelText="取消"
            confirmColor="red"
          />

          {/* 单个删除确认弹框 */}
          <ConfirmModal
            isOpen={isSingleDeleteConfirmOpen}
            onClose={() => {
              setIsSingleDeleteConfirmOpen(false);
              setPendingDeleteId(null);
            }}
            onConfirm={async () => {
              if (!pendingDeleteId) return;

              try {
                // 从数据库删除
                if (userStatus === "LOGGED_IN" && userId) {
                  const success = await deleteHistory(pendingDeleteId);
                  if (success) {
                    dispatch(removeFromHistory(pendingDeleteId));
                  } else {
                    alert("删除失败，请重试");
                    setIsSingleDeleteConfirmOpen(false);
                    setPendingDeleteId(null);
                    return;
                  }
                } else {
                  dispatch(removeFromHistory(pendingDeleteId));
                }
                dispatch(setViewingHistoryItem(null));
                setIsSingleDeleteConfirmOpen(false);
                setPendingDeleteId(null);
              } catch (error) {
                console.error("Failed to delete history:", error);
                alert("删除失败，请重试");
                setIsSingleDeleteConfirmOpen(false);
                setPendingDeleteId(null);
              }
            }}
            title="确认删除"
            message="确定要删除这条历史记录吗？删除后无法恢复。"
            confirmText="删除"
            cancelText="取消"
            confirmColor="red"
          />
        </div>
      </div>
    </TabBarWrapper>
  );
}
