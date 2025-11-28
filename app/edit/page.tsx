"use client";

import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Sparkles,
  Palette,
  ImageIcon,
  Check,
  Zap,
  Plus,
  X,
  Layers,
  Download,
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
  setSceneDrafts,
  updateSceneDraft,
  setActiveSceneDraftIndex,
  addSceneDraft,
  removeSceneDraft,
} from "@/store/slices/imageSlice";
import {
  setLoadingState,
  setIsPaymentModalOpen,
  setIsQuotaModalOpen,
} from "@/store/slices/appSlice";
import { LoadingState, UserTier, SceneDraft } from "@/types";
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
import Loader from "@/components/Loader";
import { generateExtendedScene } from "@/services/geminiService";
import { uploadImageToCloud } from "@/services/imageUploadService";
import { PRESET_STYLES } from "@/lib/constants";
import { getProxiedImageUrl } from "@/lib/image-storage";
import { getTodayDateString, normalizeDateString } from "@/lib/date-utils";
import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";

const GUEST_DAILY_LIMIT = 1; // 游客1次
const FREE_DAILY_LIMIT = 5; // 普通用户5次
const PREMIUM_DAILY_LIMIT = 50; // 会员50次

export default function EditPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sourceImage = useAppSelector((state) => state.image.sourceImage);
  const mimeType = useAppSelector((state) => state.image.mimeType);
  const prompt = useAppSelector((state) => state.image.prompt);
  const resultImage = useAppSelector((state) => state.image.resultImage);
  const selectedStyle = useAppSelector((state) => state.image.selectedStyle);
  const aspectRatio = useAppSelector((state) => state.image.aspectRatio);
  const imageSize = useAppSelector((state) => state.image.imageSize);
  const imageFormat = useAppSelector((state) => state.image.imageFormat);
  const sceneDrafts = useAppSelector((state) => state.image.sceneDrafts || []);
  const activeSceneDraftIndex =
    useAppSelector((state) => state.image.activeSceneDraftIndex) || 0;
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
  const previousSourceImageRef = useRef<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [viewingImageUrl, setViewingImageUrl] = useState<string | null>(null);

  // 判断是否是多图模式
  const isMultiImageMode = sceneDrafts && sceneDrafts.length > 0;
  const activeDraft =
    isMultiImageMode && sceneDrafts ? sceneDrafts[activeSceneDraftIndex] : null;

  // 页面初始化
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    // 初始化时设置 previousSourceImageRef
    if (sourceImage) {
      previousSourceImageRef.current = sourceImage;
    }
    setIsInitializing(false);
  }, []);

  // 检测 sourceImage 变化，如果切换图片则清空之前的状态
  useEffect(() => {
    if (!sourceImage) {
      // 如果 sourceImage 变为 null，清空引用
      previousSourceImageRef.current = null;
      return;
    }

    // 检查是否需要重置：
    // 1. previousSourceImageRef.current 存在且与新的 sourceImage 不相等（说明是切换图片）
    // 2. 或者 sceneDrafts 存在且它们的 sourceUrl 与新的 sourceImage 不匹配
    const hasPreviousImage = previousSourceImageRef.current !== null;
    const imageChanged =
      hasPreviousImage && previousSourceImageRef.current !== sourceImage;
    const draftsMismatch =
      sceneDrafts.length > 0 &&
      sceneDrafts.some((draft) => draft.sourceUrl !== sourceImage);

    if (imageChanged || draftsMismatch) {
      // 清空之前的生成结果和场景草稿
      dispatch(setResultImage(null));
      dispatch(setSceneDrafts([]));
      dispatch(setActiveSceneDraftIndex(0));
      dispatch(setPrompt(""));
    }

    // 更新之前的 sourceImage 引用
    previousSourceImageRef.current = sourceImage;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceImage, dispatch]); // 注意：sceneDrafts 不放在依赖数组中，避免循环更新

  const getLimit = () => {
    if (userTier === "PREMIUM") return PREMIUM_DAILY_LIMIT;
    if (userStatus === "LOGGED_IN") return FREE_DAILY_LIMIT;
    return GUEST_DAILY_LIMIT; // 游客
  };
  const isQuotaReached = (amount = 1) => {
    const today = getTodayDateString();
    const usageDate = normalizeDateString(sceneUsage.date);
    if (usageDate !== today) return false;
    return sceneUsage.count + amount > getLimit();
  };
  const remainingQuota = () => {
    const today = getTodayDateString();
    const usageDate = normalizeDateString(sceneUsage.date);
    if (usageDate !== today) return getLimit();
    return Math.max(0, getLimit() - sceneUsage.count);
  };

  // 检查是否可以生成（用于按钮disabled状态）
  const canGenerate = () => {
    // 如果没有图片，禁用按钮
    if (!sourceImage) return false;
    // 如果正在生成中，禁用按钮
    if (loadingState === LoadingState.GENERATING) return false;
    if (isQuotaReached()) return false;
    if (isMultiImageMode) {
      // 多场景模式：至少有一个场景有提示词
      return sceneDrafts.some((draft) => draft.prompt && draft.prompt.trim());
    } else {
      // 单场景模式：主提示词不为空
      return prompt.trim().length > 0;
    }
  };

  // 批量下载所有生成完成的场景图片
  const handleBatchDownload = async () => {
    const completedDrafts = sceneDrafts.filter(
      (draft) => draft.status === "done" && draft.generatedUrl
    );

    if (completedDrafts.length === 0) {
      alert("没有可下载的图片");
      return;
    }

    try {
      const zip = new JSZip();

      // 下载并添加每个图片到 zip
      for (let i = 0; i < completedDrafts.length; i++) {
        const draft = completedDrafts[i];
        const imageUrl = getProxiedImageUrl(draft.generatedUrl!);

        // 使用 fetch 获取图片
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // 获取文件扩展名
        const contentType = response.headers.get("content-type") || "image/png";
        let ext = "png";
        if (contentType.includes("jpeg") || contentType.includes("jpg")) {
          ext = "jpg";
        } else if (contentType.includes("webp")) {
          ext = "webp";
        }

        // 添加到 zip
        zip.file(`scene_${i + 1}.${ext}`, blob);
      }

      // 生成 zip 文件
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scenes-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("批量下载失败:", error);
      alert("批量下载失败，请重试");
    }
  };

  const handleGenerate = async () => {
    // 先检查次数
    const pendingCount =
      isMultiImageMode && sceneDrafts
        ? sceneDrafts.filter(
            (d) => d.status === "pending" || d.status === "error"
          ).length
        : 1;

    if (isQuotaReached(pendingCount)) {
      dispatch(setIsQuotaModalOpen(true));
      return;
    }

    if (isMultiImageMode) {
      // 多图模式：批量生成
      await handleBatchGenerate();
    } else {
      // 单图模式：支持多场景
      if (!sourceImage) {
        return;
      }

      // 如果有多个场景，检查每个场景是否有提示词
      if (sceneDrafts.length > 0) {
        const hasEmptyPrompt = sceneDrafts.some(
          (draft) => !draft.prompt || draft.prompt.trim() === ""
        );
        if (hasEmptyPrompt) {
          alert("请为所有场景填写提示词");
          return;
        }
      } else {
        // 单场景模式，检查主提示词
        if (!prompt || prompt.trim() === "") {
          return;
        }
      }

      dispatch(setLoadingState(LoadingState.GENERATING));
      router.push("/result");

      try {
        let styleLabels = "";
        let styleModifier = "";
        if (selectedStyle) {
          const styleObj = PRESET_STYLES.find((s) => s.id === selectedStyle);
          if (styleObj) {
            styleLabels = styleObj.label;
            styleModifier = `. Style modifiers: ${styleObj.value}`;
          }
        }

        // 如果有多个场景，使用场景提示词；否则使用主提示词
        let prompts: string[];
        if (sceneDrafts.length > 0) {
          prompts = sceneDrafts.map((draft) => {
            const basePrompt = draft.prompt || "";
            return styleModifier ? `${basePrompt}${styleModifier}` : basePrompt;
          });
        } else {
          const finalPrompt = styleModifier
            ? `${prompt}${styleModifier}`
            : prompt;
          prompts = [finalPrompt];
        }

        const result = await generateExtendedScene(
          sourceImage,
          mimeType,
          prompts,
          aspectRatio
        );

        // 上传图片到云存储
        let cloudImageUrl = result;
        if (result.startsWith("data:image")) {
          let detectedMimeType = "image/png";
          if (result.startsWith("data:image/png")) {
            detectedMimeType = "image/png";
          } else if (
            result.startsWith("data:image/jpeg") ||
            result.startsWith("data:image/jpg")
          ) {
            detectedMimeType = "image/jpeg";
          } else if (result.startsWith("data:image/webp")) {
            detectedMimeType = "image/webp";
          }

          const uploadResult = await uploadImageToCloud(
            result,
            undefined,
            detectedMimeType
          );
          if (uploadResult && uploadResult.url) {
            cloudImageUrl = uploadResult.url;
          } else {
            console.warn("Failed to upload image to cloud, using base64 URL");
          }
        }

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
          cloudImageUrl,
          prompt,
          styleLabels
        );

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

        dispatch(setResultImage(cloudImageUrl));
        dispatch(setLoadingState(LoadingState.SUCCESS));
      } catch (err) {
        console.error(err);
        dispatch(setLoadingState(LoadingState.ERROR));
      }
    }
  };

  // 批量生成场景扩展
  const handleBatchGenerate = async () => {
    if (!sceneDrafts || sceneDrafts.length === 0) return;

    dispatch(setLoadingState(LoadingState.GENERATING));

    for (let i = 0; i < sceneDrafts.length; i++) {
      const draft = sceneDrafts[i];
      if (draft.status !== "pending" && draft.status !== "error") continue;

      try {
        dispatch(
          updateSceneDraft({
            index: i,
            draft: { status: "generating" },
          })
        );

        let finalPrompt = draft.prompt || prompt;
        let styleLabels = draft.style || "";
        if (selectedStyle && !draft.style) {
          const styleObj = PRESET_STYLES.find((s) => s.id === selectedStyle);
          if (styleObj) {
            styleLabels = styleObj.label;
            finalPrompt = `${draft.prompt || prompt}. Style modifiers: ${
              styleObj.value
            }`;
          }
        }

        const result = await generateExtendedScene(
          draft.sourceUrl,
          draft.sourceMimeType,
          finalPrompt,
          aspectRatio
        );

        // 上传图片到云存储
        let cloudImageUrl = result;
        if (result.startsWith("data:image")) {
          let detectedMimeType = "image/png";
          if (result.startsWith("data:image/png")) {
            detectedMimeType = "image/png";
          } else if (
            result.startsWith("data:image/jpeg") ||
            result.startsWith("data:image/jpg")
          ) {
            detectedMimeType = "image/jpeg";
          } else if (result.startsWith("data:image/webp")) {
            detectedMimeType = "image/webp";
          }

          const uploadResult = await uploadImageToCloud(
            result,
            undefined,
            detectedMimeType
          );
          if (uploadResult && uploadResult.url) {
            cloudImageUrl = uploadResult.url;
          } else {
            console.warn("Failed to upload image to cloud, using base64 URL");
          }
        }

        // 更新草稿状态
        dispatch(
          updateSceneDraft({
            index: i,
            draft: { generatedUrl: cloudImageUrl, status: "done" },
          })
        );

        // 保存历史记录
        await saveHistory(
          "scene",
          cloudImageUrl,
          draft.prompt || prompt,
          styleLabels
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
      } catch (err) {
        console.error("Scene generation error:", err);
        dispatch(updateSceneDraft({ index: i, draft: { status: "error" } }));
      }
    }

    dispatch(setLoadingState(LoadingState.SUCCESS));
  };

  const quotaReached = isQuotaReached();

  // 如果还在初始化，显示加载状态
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader message="加载场景扩展草稿..." />
      </div>
    );
  }

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
          <div className="space-y-6 mt-4 md:mt-8">
            {isMultiImageMode ? (
              // 多图模式：显示多个图片
              <div className="space-y-4">
                {activeDraft ? (
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative">
                    <img
                      src={getProxiedImageUrl(
                        activeDraft.generatedUrl || activeDraft.sourceUrl
                      )}
                      alt="Active Preview"
                      className={`w-full h-48 md:h-64 object-contain bg-gray-100 rounded-xl ${
                        activeDraft.status === "done" &&
                        activeDraft.generatedUrl
                          ? "cursor-pointer hover:opacity-90 transition-opacity"
                          : ""
                      }`}
                      onClick={() => {
                        if (
                          activeDraft.status === "done" &&
                          activeDraft.generatedUrl
                        ) {
                          setViewingImageUrl(
                            getProxiedImageUrl(activeDraft.generatedUrl)
                          );
                        }
                      }}
                    />
                    {activeDraft.status === "generating" && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                ) : sourceImage ? (
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <img
                      src={sourceImage}
                      alt="Preview"
                      className="w-full h-48 md:h-64 object-contain bg-gray-100 rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-full h-48 md:h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <ImageIcon size={48} className="text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">请先上传图片</p>
                    </div>
                  </div>
                )}
                {/* 只显示有生成结果的场景缩略图，如果都没有生成结果则不显示缩略图列表 */}
                {sceneDrafts &&
                  sceneDrafts.length > 1 &&
                  sceneDrafts.some((d) => d.generatedUrl) && (
                    <div className="space-y-2">
                      <div className="flex gap-2 overflow-x-auto max-w-full p-2 bg-white/50 rounded-xl backdrop-blur-md md:flex-wrap md:justify-center">
                        {sceneDrafts.map((draft, idx) => (
                          <div
                            key={draft.id}
                            onClick={() =>
                              dispatch(setActiveSceneDraftIndex(idx))
                            }
                            className={`w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 flex-shrink-0 overflow-hidden cursor-pointer relative transition-all hover:scale-105 ${
                              idx === activeSceneDraftIndex
                                ? "border-violet-600 ring-2 ring-violet-200"
                                : "border-gray-200"
                            }`}
                          >
                            <img
                              src={getProxiedImageUrl(
                                draft.generatedUrl || draft.sourceUrl
                              )}
                              alt={`Draft ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {draft.status === "done" && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                            )}
                            {draft.status === "generating" && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                              </div>
                            )}
                            {draft.status === "error" && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                            )}
                          </div>
                        ))}
                      </div>
                      {/* 批量下载按钮 */}
                      {sceneDrafts.filter(
                        (d) => d.status === "done" && d.generatedUrl
                      ).length > 1 && (
                        <button
                          onClick={handleBatchDownload}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium text-sm"
                        >
                          <Download size={16} />
                          批量下载所有场景 (
                          {
                            sceneDrafts.filter(
                              (d) => d.status === "done" && d.generatedUrl
                            ).length
                          }{" "}
                          张)
                        </button>
                      )}
                    </div>
                  )}
              </div>
            ) : (
              // 单图模式：原有显示
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                {sourceImage ? (
                  <>
                    <img
                      src={sourceImage}
                      alt="Preview"
                      className="w-full h-48 md:h-64 object-contain bg-gray-100 rounded-xl"
                    />
                    {resultImage && (
                      <div className="mt-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <img
                          src={getProxiedImageUrl(resultImage)}
                          alt="Generated Result"
                          className="w-full h-48 md:h-64 object-contain bg-gray-100 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => {
                            setViewingImageUrl(getProxiedImageUrl(resultImage));
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-48 md:h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <ImageIcon size={48} className="text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">请先上传图片</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            {/* 多场景管理 */}
            <div className="space-y-3 mt-4 md:mt-8">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
                  <Layers size={16} className="text-violet-500" />
                  场景扩展
                  {sceneDrafts.length > 0 && (
                    <span className="text-xs text-gray-500 font-normal">
                      ({sceneDrafts.length}/5 个场景)
                    </span>
                  )}
                </label>
                <button
                  onClick={() => {
                    if (!sourceImage || sceneDrafts.length >= 5) return;
                    const newDraft: SceneDraft = {
                      id: `scene-${Date.now()}`,
                      sourceUrl: sourceImage,
                      sourceMimeType: mimeType,
                      generatedUrl: null,
                      prompt: "",
                      status: "pending",
                    };
                    dispatch(addSceneDraft(newDraft));
                    dispatch(setActiveSceneDraftIndex(sceneDrafts.length));
                  }}
                  disabled={!sourceImage || sceneDrafts.length >= 5}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-violet-600 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={sceneDrafts.length >= 5 ? "最多只能添加5个场景" : ""}
                >
                  <Plus size={14} />
                  添加场景
                </button>
              </div>
              {sceneDrafts.length >= 5 && (
                <p className="text-xs text-gray-500 ml-1">
                  已达到最大场景数量（5个）
                </p>
              )}

              {sceneDrafts.length === 0 ? (
                // 单场景模式
                <div className="space-y-3">
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => {
                        dispatch(setPrompt(e.target.value));
                      }}
                      placeholder="例如：让这只猫咪坐在充满未来感的霓虹城市街道上，下着小雨..."
                      className="w-full p-4 md:p-6 pb-12 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none text-gray-700 shadow-sm h-32 md:h-40 text-sm md:text-base leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                // 多场景模式
                <div className="space-y-3">
                  {sceneDrafts.map((draft, index) => (
                    <div
                      key={draft.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        index === activeSceneDraftIndex
                          ? "border-violet-500 bg-violet-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-600">
                            场景 {index + 1}
                          </span>
                          {draft.status === "done" && (
                            <span className="text-xs text-green-600">
                              ✓ 已完成
                            </span>
                          )}
                          {draft.status === "generating" && (
                            <span className="text-xs text-blue-600">
                              生成中...
                            </span>
                          )}
                          {draft.status === "error" && (
                            <span className="text-xs text-red-600">✗ 失败</span>
                          )}
                        </div>
                        {sceneDrafts.length > 1 && (
                          <button
                            onClick={() => {
                              dispatch(removeSceneDraft(index));
                              if (
                                activeSceneDraftIndex >=
                                sceneDrafts.length - 1
                              ) {
                                dispatch(
                                  setActiveSceneDraftIndex(
                                    Math.max(0, sceneDrafts.length - 2)
                                  )
                                );
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <textarea
                        value={draft.prompt || ""}
                        onChange={(e) => {
                          dispatch(
                            updateSceneDraft({
                              index,
                              draft: { prompt: e.target.value },
                            })
                          );
                        }}
                        onClick={() =>
                          dispatch(setActiveSceneDraftIndex(index))
                        }
                        placeholder={`场景 ${index + 1} 的提示词...`}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none text-gray-700 shadow-sm h-24 text-sm"
                      />
                    </div>
                  ))}
                  <p className="text-xs text-gray-500">
                    提示：每个场景可以设置不同的提示词，保持角色的一致性。
                  </p>
                </div>
              )}
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
          disabled={!canGenerate()}
          className={`w-full py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95
            ${
              !canGenerate()
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-violet-600 text-white shadow-violet-200 hover:bg-violet-700"
            }`}
        >
          {quotaReached ? (
            <span>今日额度已用完</span>
          ) : loadingState === LoadingState.GENERATING ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>生成中...</span>
            </>
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

      {/* Image View Modal */}
      {viewingImageUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4"
          onClick={() => setViewingImageUrl(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-end mb-4">
              <div className="flex items-center gap-3">
                <a
                  href={viewingImageUrl}
                  download={`ip-creative-${Date.now()}.png`}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={18} />
                  下载图片
                </a>
                <button
                  onClick={() => setViewingImageUrl(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center overflow-auto bg-black/50 rounded-xl p-4">
              <img
                src={viewingImageUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => dispatch(setIsPaymentModalOpen(false))}
        onSuccess={(tier) => {
          dispatch(setUserTier(tier));
          dispatch(setIsPaymentModalOpen(false));
        }}
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
