"use client";

import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Sparkles,
  Palette,
  ImageIcon,
  Check,
  Zap,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setPrompt,
  setSelectedStyle,
  setAspectRatio,
  setImageSize,
  setImageFormat,
  setResultImage,
  addToHistory,
  resetImageState,
  setSourceImage,
} from "@/store/slices/imageSlice";
import {
  setLoadingState,
  setIsPaymentModalOpen,
  setIsQuotaModalOpen,
} from "@/store/slices/appSlice";
import { LoadingState, UserTier } from "@/types";
import {
  updateSceneUsage,
  setUserTier,
  setSceneUsage,
} from "@/store/slices/userSlice";
import { updateSceneUsage as updateSceneUsageAPI } from "@/services/userService";
import { saveHistory } from "@/services/historyService";
import { getCurrentUserId } from "@/services/authService";
import PaymentModal from "@/components/PaymentModal";
import QuotaModal from "@/components/QuotaModal";
import { generateExtendedScene } from "@/services/geminiService";
import { PRESET_STYLES } from "@/lib/constants";
import { loadSourceImage, saveSourceImage } from "@/lib/image-storage";
import { getTodayDateString, normalizeDateString } from "@/lib/date-utils";
import { useEffect, useRef } from "react";

const GUEST_DAILY_LIMIT = 1; // 游客1次
const FREE_DAILY_LIMIT = 5; // 普通用户5次
const PREMIUM_DAILY_LIMIT = 50; // 会员50次

export default function EditPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sourceImage = useAppSelector((state) => state.image.sourceImage);
  const mimeType = useAppSelector((state) => state.image.mimeType);
  const prompt = useAppSelector((state) => state.image.prompt);
  const selectedStyle = useAppSelector((state) => state.image.selectedStyle);
  const aspectRatio = useAppSelector((state) => state.image.aspectRatio);
  const imageSize = useAppSelector((state) => state.image.imageSize);
  const imageFormat = useAppSelector((state) => state.image.imageFormat);
  const loadingState = useAppSelector((state) => state.app.loadingState);
  const errorMsg = useAppSelector((state) => state.app.errorMsg);
  const userStatus = useAppSelector((state) => state.user.status);
  const userId = useAppSelector((state) => state.user.userId);
  const userTier = useAppSelector((state) => state.user.userTier);
  const sceneUsage = useAppSelector((state) => state.user.sceneUsage);
  const isPaymentModalOpen = useAppSelector(
    (state) => state.app.isPaymentModalOpen
  );
  const isQuotaModalOpen = useAppSelector(
    (state) => state.app.isQuotaModalOpen
  );
  const initializedRef = useRef(false);

  // 页面加载时，如果 Redux 中没有图片，从 localStorage 恢复
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // 如果 Redux 中没有图片，尝试从 localStorage 加载
    if (!sourceImage) {
      const savedImage = loadSourceImage();
      if (savedImage) {
        dispatch(
          setSourceImage({
            image: savedImage.image,
            mimeType: savedImage.mimeType,
          })
        );
      }
    }
  }, [sourceImage, dispatch]); // 监听 sourceImage，确保在 Redux 状态加载后也能恢复

  // 当 sourceImage 更新时，同步到 localStorage（每次进入 edit 都会替换最新的图片）
  useEffect(() => {
    if (sourceImage) {
      saveSourceImage(sourceImage, mimeType);
    }
  }, [sourceImage, mimeType]);

  const getLimit = () => {
    if (userTier === "PREMIUM") return PREMIUM_DAILY_LIMIT;
    if (userStatus === "LOGGED_IN") return FREE_DAILY_LIMIT;
    return GUEST_DAILY_LIMIT; // 游客
  };
  const isQuotaReached = () => {
    const today = getTodayDateString();
    const usageDate = normalizeDateString(sceneUsage.date);
    if (usageDate !== today) return false;
    return sceneUsage.count >= getLimit();
  };
  const remainingQuota = () => {
    const today = getTodayDateString();
    const usageDate = normalizeDateString(sceneUsage.date);
    if (usageDate !== today) return getLimit();
    return Math.max(0, getLimit() - sceneUsage.count);
  };

  const handleGenerate = async () => {
    // 先检查次数
    if (isQuotaReached()) {
      dispatch(setIsQuotaModalOpen(true));
      return;
    }

    if (!sourceImage || !prompt) {
      return;
    }

    dispatch(setLoadingState(LoadingState.GENERATING));
    router.push("/result");

    try {
      let finalPrompt = prompt;
      let styleLabels = "";
      if (selectedStyle) {
        const styleObj = PRESET_STYLES.find((s) => s.id === selectedStyle);
        if (styleObj) {
          styleLabels = styleObj.label;
          finalPrompt = `${prompt}. Style modifiers: ${styleObj.value}`;
        }
      }

      const result = await generateExtendedScene(
        sourceImage,
        mimeType,
        finalPrompt,
        aspectRatio
        // imageSize, // Commented out as per user request
        // imageFormat // Commented out as per user request
      );
      // 场景扩展生成成功，增加使用次数
      dispatch(updateSceneUsage(1));

      // 如果用户已登录，同步到后端
      if (userStatus === "LOGGED_IN" && userId) {
        try {
          const updatedUsage = await updateSceneUsageAPI(userId, 1);
          dispatch(setSceneUsage(updatedUsage));
        } catch (error) {
          console.error("Failed to sync scene usage to backend:", error);
        }
      }

      // 保存历史记录到数据库
      const historyItem = await saveHistory(
        "scene",
        result,
        prompt,
        styleLabels
      );

      // 如果保存成功，添加到 Redux（用于即时显示）
      if (historyItem) {
        const newHistoryItem = {
          id: historyItem.id,
          url: historyItem.url,
          timestamp: historyItem.timestamp,
          prompt: historyItem.prompt,
          style: historyItem.style,
        };
        dispatch(addToHistory(newHistoryItem));
      }

      dispatch(setResultImage(result));
      dispatch(setLoadingState(LoadingState.SUCCESS));
    } catch (err) {
      console.error(err);
      dispatch(setLoadingState(LoadingState.ERROR));
    }
  };

  const quotaReached = isQuotaReached();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 md:pt-16">
      <header className="bg-white px-4 md:hidden py-3 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center gap-4">
        <button
          onClick={() => router.push("/create")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="font-bold text-lg text-gray-800">创意工坊</h2>
        <div className="ml-auto">
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${
              quotaReached
                ? "bg-red-50 text-red-500 border-red-100"
                : "bg-violet-50 text-violet-600 border-violet-100"
            }`}
          >
            <Zap size={12} fill="currentColor" />
            {remainingQuota()} / {getLimit()}
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 md:p-12 space-y-6 overflow-y-auto max-w-6xl mx-auto w-full">
        {/* PC端消耗次数展示 */}
        <div className="hidden md:flex items-center justify-end mb-2">
          <div
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border ${
              quotaReached
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-violet-50 text-violet-700 border-violet-200"
            }`}
          >
            <Zap size={16} fill="currentColor" />
            <span className="font-semibold">
              {remainingQuota()} / {getLimit()}
            </span>
          </div>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-8 md:items-start">
          {/* Left Column - Image Preview */}
          <div className="space-y-6">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
              {sourceImage && (
                <img
                  src={sourceImage}
                  alt="Preview"
                  className="w-full h-48 md:h-64 object-contain bg-gray-100 rounded-xl"
                />
              )}
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
                <Sparkles size={16} className="text-violet-500" />
                你想如何扩展这个场景？
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => dispatch(setPrompt(e.target.value))}
                  placeholder="例如：让这只猫咪坐在充满未来感的霓虹城市街道上，下着小雨..."
                  className="w-full p-4 md:p-6 pb-12 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none text-gray-700 shadow-sm h-32 md:h-40 text-sm md:text-base leading-relaxed"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
                <Palette size={16} className="text-violet-500" />
                艺术风格
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {PRESET_STYLES.map((style) => {
                  const isSelected = selectedStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() =>
                        dispatch(setSelectedStyle(isSelected ? null : style.id))
                      }
                      className={`
                        relative px-2 py-3 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 border
                        flex flex-col items-center justify-center gap-1 overflow-hidden
                        ${
                          isSelected
                            ? "bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-200"
                            : "bg-white border-gray-200 text-gray-600 hover:border-violet-200 hover:bg-gray-50"
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <Check size={12} className="text-violet-600" />
                        </div>
                      )}
                      <span>{style.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
                <ImageIcon size={16} className="text-violet-500" />
                图片比例
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  "1:1",
                  "16:9",
                  "9:16",
                  "4:3",
                  "3:4",
                  "21:9",
                  "3:2",
                  "2:3",
                  "5:4",
                  "4:5",
                ].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => dispatch(setAspectRatio(ratio))}
                    className={`
                      px-3 py-2 rounded-xl text-xs font-medium transition-all border
                      ${
                        aspectRatio === ratio
                          ? "bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-200"
                          : "bg-white border-gray-200 text-gray-600 hover:border-violet-200 hover:bg-gray-50"
                      }
                    `}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* 暂时注释掉分辨率的展示 */}
            {/* <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
                <ImageIcon size={16} className="text-violet-500" />
                分辨率
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["1K", "2K", "4K"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => dispatch(setImageSize(size))}
                    className={`
                      px-4 py-3 rounded-xl text-sm font-medium transition-all border
                      ${
                        imageSize === size
                          ? "bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-200"
                          : "bg-white border-gray-200 text-gray-600 hover:border-violet-200 hover:bg-gray-50"
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div> */}

            {/* 暂时注释掉图片格式的展示 */}
            {/* <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
                <ImageIcon size={16} className="text-violet-500" />
                图片格式
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["PNG", "JPEG", "WEBP"] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => dispatch(setImageFormat(format))}
                    className={`
                      px-4 py-3 rounded-xl text-sm font-medium transition-all border
                      ${
                        imageFormat === format
                          ? "bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-200"
                          : "bg-white border-gray-200 text-gray-600 hover:border-violet-200 hover:bg-gray-50"
                      }
                    `}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 pb-4 pt-2 bg-gradient-to-t from-gray-50 to-transparent max-w-6xl mx-auto w-full">
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || quotaReached}
          className={`w-full py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95
            ${
              !prompt.trim() || quotaReached
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-violet-600 text-white shadow-violet-200 hover:bg-violet-700"
            }`}
        >
          {quotaReached ? (
            <span>今日额度已用完</span>
          ) : (
            <>
              <Sparkles size={18} />
              立即生成
            </>
          )}
        </button>
        {quotaReached && (
          <p
            onClick={() => router.push("/profile")}
            className="text-center text-xs text-violet-600 mt-2 cursor-pointer hover:underline"
          >
            升级会员获取更多额度 &rarr;
          </p>
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
        productDesc="解锁每日 50 次场景扩展和 50 次表情包制作额度"
      />

      {/* Quota Modal */}
      <QuotaModal
        isOpen={isQuotaModalOpen}
        onClose={() => dispatch(setIsQuotaModalOpen(false))}
        onLogin={() => router.push("/login")}
        onUpgrade={() => dispatch(setIsPaymentModalOpen(true))}
        userStatus={userStatus}
        remainingQuota={remainingQuota()}
        limit={getLimit()}
        type="scene"
      />
    </div>
  );
}
