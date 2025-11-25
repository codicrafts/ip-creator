"use client";

import { useRouter } from "next/navigation";
import {
  Clock,
  ImageIcon,
  Crown,
  Zap,
  LogOut,
  Check,
  Square,
  Trash2,
  X,
  Download,
  Smile,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setIsSelectionMode,
  setSelectedHistoryIds,
  toggleHistorySelection,
  setViewingHistoryItem,
  setIsPaymentModalOpen,
} from "@/store/slices/appSlice";
import { removeFromHistory, setHistory } from "@/store/slices/imageSlice";
import { deleteHistory } from "@/services/historyService";
import { setUserTier, clearUserInfo } from "@/store/slices/userSlice";
import { logout } from "@/services/authService";
import { UserTier } from "@/types";
import { setMemeDrafts, setActiveDraftIndex } from "@/store/slices/memeSlice";
import { AnimationType } from "@/types";
import PaymentModal from "@/components/PaymentModal";

const FREE_DAILY_LIMIT = 5;
const PREMIUM_DAILY_LIMIT = 50;

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector((state) => state.user.status);
  const userId = useAppSelector((state) => state.user.userId);
  const phone = useAppSelector((state) => state.user.phone);
  const isPremium = useAppSelector(
    (state) => state.user.userTier === UserTier.PREMIUM
  );
  const sceneUsage = useAppSelector((state) => state.user.sceneUsage);
  const memeUsage = useAppSelector((state) => state.user.memeUsage);
  const history = useAppSelector((state) => state.image.history);
  const isSelectionMode = useAppSelector((state) => state.app.isSelectionMode);
  const selectedHistoryIds = useAppSelector(
    (state) => state.app.selectedHistoryIds
  );
  const viewingHistoryItemId = useAppSelector(
    (state) => state.app.viewingHistoryItem
  );
  const isPaymentModalOpen = useAppSelector(
    (state) => state.app.isPaymentModalOpen
  );

  const GUEST_DAILY_LIMIT = 1; // 游客1次
  const limit = isPremium
    ? PREMIUM_DAILY_LIMIT
    : userStatus === "LOGGED_IN"
    ? FREE_DAILY_LIMIT
    : GUEST_DAILY_LIMIT;

  // 直接使用后端返回的 count（后端已处理日期判断和重置）
  const sceneUsed = sceneUsage.count || 0;
  const memeUsed = memeUsage.count || 0;
  const sceneRemaining = Math.max(0, limit - sceneUsed);
  const memeRemaining = Math.max(0, limit - memeUsed);
  const scenePercentage = Math.min(100, (sceneUsed / limit) * 100);
  const memePercentage = Math.min(100, (memeUsed / limit) * 100);
  const viewingHistoryItem = viewingHistoryItemId
    ? history.find((item) => item.id === viewingHistoryItemId)
    : null;

  // 历史记录已在 SSR 侧加载，不再需要客户端加载
  // 如果需要刷新历史记录，可以在这里添加刷新逻辑

  const startBatchMemeCreation = () => {
    const selectedItems = history.filter((h) =>
      selectedHistoryIds.includes(h.id)
    );
    if (selectedItems.length === 0) return;

    const drafts = selectedItems.map((item) => ({
      id: Date.now() + Math.random().toString(),
      sourceUrl: item.url,
      generatedUrl: null,
      text: "配文",
      moodPrompt: "可爱的表情",
      status: "pending" as const,
      animation: AnimationType.NONE,
    }));

    dispatch(setMemeDrafts(drafts));
    dispatch(setActiveDraftIndex(0));
    dispatch(setIsSelectionMode(false));
    dispatch(setSelectedHistoryIds([]));
    router.push("/meme-editor");
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ backgroundColor: "#f9fafb" }}
    >
      <div
        className="flex flex-col min-h-screen bg-gray-50 pb-24 md:pt-16"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* User Card */}
          {!isSelectionMode && (
            <div
              className={`relative rounded-3xl p-6 text-white overflow-hidden shadow-lg transition-all duration-500 ${
                isPremium
                  ? "bg-gradient-to-br from-slate-800 to-slate-900 shadow-slate-200"
                  : "bg-gradient-to-br from-violet-500 to-violet-600 shadow-violet-200"
              }`}
            >
              {isPremium && (
                <div className="absolute -right-8 -top-8 text-white/10">
                  <Crown size={120} />
                </div>
              )}

              <div className="relative z-10 flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                    {isPremium ? "💎" : "🎨"}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">
                      {isPremium
                        ? "尊贵会员"
                        : userStatus === "LOGGED_IN"
                        ? "普通用户"
                        : "游客"}
                    </h3>
                    <p className="text-white/80 text-xs flex items-center gap-1 mt-1">
                      {userStatus === "LOGGED_IN" && phone ? (
                        <>
                          ID: {phone}
                          {isPremium && (
                            <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-1.5 rounded ml-1">
                              PRO
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          ID: 游客
                          {isPremium && (
                            <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-1.5 rounded ml-1">
                              PRO
                            </span>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                {userStatus === "LOGGED_IN" && (
                  <button
                    onClick={async () => {
                      await logout();
                      dispatch(clearUserInfo());
                      router.push("/");
                    }}
                    className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors bg-white/10 hover:bg-white/20 text-white border border-white/20 whitespace-nowrap"
                  >
                    <LogOut size={16} /> 退出登录
                  </button>
                )}
              </div>

              <div className="relative z-10 space-y-3">
                {/* 场景扩展额度 */}
                <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs text-white/80">场景扩展额度</span>
                    <span className="font-mono font-bold text-xl">
                      {sceneRemaining}{" "}
                      <span className="text-sm text-white/60">/ {limit}</span>
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isPremium ? "bg-amber-400" : "bg-white"
                      }`}
                      style={{ width: `${100 - scenePercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* 表情包制作额度 */}
                <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs text-white/80">
                      表情包制作额度
                    </span>
                    <span className="font-mono font-bold text-xl">
                      {memeRemaining}{" "}
                      <span className="text-sm text-white/60">/ {limit}</span>
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isPremium ? "bg-amber-400" : "bg-white"
                      }`}
                      style={{ width: `${100 - memePercentage}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-[10px] text-white/60 text-right">
                  每日 00:00 重置
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                {userStatus === "GUEST" && (
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    <Zap size={16} /> 登录获取更多额度
                  </button>
                )}
                {userStatus === "LOGGED_IN" && (
                  <button
                    onClick={() => {
                      if (isPremium) {
                        dispatch(setUserTier(UserTier.FREE));
                      } else {
                        dispatch(setIsPaymentModalOpen(true));
                      }
                    }}
                    className={`w-full py-3 md:py-2.5 rounded-xl font-semibold text-sm md:text-sm flex items-center justify-center gap-2 transition-colors ${
                      isPremium
                        ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        : "bg-amber-400 text-amber-900 hover:bg-amber-300 shadow-lg shadow-amber-900/20"
                    }`}
                  >
                    {isPremium ? (
                      <>
                        <Crown size={18} className="md:w-4 md:h-4" />
                        <span className="hidden sm:inline">
                          切换回普通版 (测试)
                        </span>
                        <span className="sm:hidden text-base">切换普通版</span>
                      </>
                    ) : (
                      <>
                        <Crown size={18} className="md:w-4 md:h-4" />

                        <span className="text-base font-bold">升级会员</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 会员权益说明 */}
          {!isSelectionMode && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Crown size={20} className="text-amber-500" />
                <h3 className="font-bold text-lg text-gray-800">会员权益</h3>
              </div>
              <div className="space-y-4">
                {/* 使用额度权益 */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                    <Check size={14} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">
                      每日使用额度
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <span className="font-medium text-amber-600">50 次</span>{" "}
                      场景扩展 +{" "}
                      <span className="font-medium text-amber-600">50 次</span>{" "}
                      表情包制作
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      普通用户每日仅 5 次额度
                    </p>
                  </div>
                </div>

                {/* 分辨率设置权益 */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                    <Check size={14} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">
                      场景扩展分辨率设置
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      支持自定义分辨率设置，生成更高质量的场景扩展图片
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      普通用户使用默认分辨率
                    </p>
                  </div>
                </div>

                {/* 其他权益提示 */}
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    更多会员专属功能持续更新中...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* History Section */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Clock size={18} className="text-violet-500" />
                {isSelectionMode ? "请选择图片 (1-9张)" : "创作历史"}
              </h3>
              <div className="flex items-center gap-3">
                {history.length > 0 && !isSelectionMode && (
                  <span className="text-xs text-gray-400">
                    最近 {history.length} 条
                  </span>
                )}
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
              </div>
            </div>

            {history.length === 0 ? (
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-20">
                {history.map((item) => (
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
                      bg-white rounded-2xl overflow-hidden shadow-sm border flex flex-col transition-all cursor-pointer group relative
                      ${
                        isSelectionMode && selectedHistoryIds.includes(item.id)
                          ? "border-violet-500 ring-2 ring-violet-200"
                          : "border-gray-100"
                      }
                    `}
                  >
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={item.url}
                        alt="History"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-800 font-medium line-clamp-2 mb-1">
                        {item.prompt}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>
                          {new Date(item.timestamp).toLocaleDateString(
                            undefined,
                            { month: "numeric", day: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
              onClick={startBatchMemeCreation}
              className="bg-violet-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition-colors flex items-center gap-2"
            >
              <Smile size={16} /> 制作表情包
            </button>
          </div>
        )}

        {/* Full Screen History Viewer Modal */}
        {viewingHistoryItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <button
              onClick={() => dispatch(setViewingHistoryItem(null))}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="w-full max-w-lg md:max-w-4xl flex flex-col gap-6">
              <img
                src={viewingHistoryItem.url}
                className="w-full h-auto max-h-[60vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl shadow-violet-900/20"
              />

              <div className="space-y-4 px-2">
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
                    onClick={async () => {
                      // 从数据库删除
                      if (userStatus === "LOGGED_IN" && userId) {
                        const success = await deleteHistory(
                          viewingHistoryItem.id
                        );
                        if (success) {
                          dispatch(removeFromHistory(viewingHistoryItem.id));
                        }
                      } else {
                        dispatch(removeFromHistory(viewingHistoryItem.id));
                      }
                      dispatch(setViewingHistoryItem(null));
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
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => dispatch(setIsPaymentModalOpen(false))}
        onSuccess={() => {
          dispatch(setUserTier(UserTier.PREMIUM));
          dispatch(setIsPaymentModalOpen(false));
        }}
        amount={29.9}
        productName="IP 创想坊会员"
        productDesc="解锁每日 50 次生成额度"
      />
    </div>
  );
}
