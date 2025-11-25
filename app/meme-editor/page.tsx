"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  ChevronLeft,
  Layers,
  Play,
  Smile,
  Wand2,
  Package,
  Loader2,
  Square,
  Activity,
  RefreshCcw,
  Zap,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setMemeDrafts,
  updateMemeDraft,
  setActiveDraftIndex,
  setSelectedMoodPack,
  setIsExporting,
  setExportWithBackground,
} from "@/store/slices/memeSlice";
import { updateMemeUsage, setMemeUsage } from "@/store/slices/userSlice";
import { updateMemeUsage as updateMemeUsageAPI } from "@/services/userService";
import { saveHistory } from "@/services/historyService";
import {
  setIsPaymentModalOpen,
  setIsQuotaModalOpen,
} from "@/store/slices/appSlice";
import { setUserTier } from "@/store/slices/userSlice";
import { UserTier } from "@/types";
import { generateSticker } from "@/services/geminiService";
import { MOOD_PACKS, ANIMATION_OPTIONS } from "@/lib/constants";
import { getTodayDateString, normalizeDateString } from "@/lib/date-utils";
import { AnimationType } from "@/types";
import Loader from "@/components/Loader";
import PaymentModal from "@/components/PaymentModal";
import QuotaModal from "@/components/QuotaModal";
import { loadMemeDrafts, saveMemeDrafts } from "@/lib/meme-storage";
import JSZip from "jszip";

declare global {
  interface Window {
    gifshot?: any;
  }
}

export default function MemeEditorPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const memeDrafts = useAppSelector((state) => state.meme.memeDrafts);
  const activeDraftIndex = useAppSelector(
    (state) => state.meme.activeDraftIndex
  );
  const selectedMoodPack = useAppSelector(
    (state) => state.meme.selectedMoodPack
  );
  const isExporting = useAppSelector((state) => state.meme.isExporting);
  const exportWithBackground = useAppSelector(
    (state) => state.meme.exportWithBackground
  );
  const memeUsage = useAppSelector((state) => state.user.memeUsage);
  const userStatus = useAppSelector((state) => state.user.status);
  const userId = useAppSelector((state) => state.user.userId);
  const userTier = useAppSelector((state) => state.user.userTier);
  const isPaymentModalOpen = useAppSelector(
    (state) => state.app.isPaymentModalOpen
  );
  const isQuotaModalOpen = useAppSelector(
    (state) => state.app.isQuotaModalOpen
  );
  const initializedRef = useRef(false);

  // 页面加载时，如果 Redux 中没有草稿，从 localStorage 恢复
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // 如果 Redux 中没有草稿，尝试从 localStorage 加载
    if (memeDrafts.length === 0) {
      const saved = loadMemeDrafts();
      if (saved && saved.drafts.length > 0) {
        dispatch(setMemeDrafts(saved.drafts));
        dispatch(setActiveDraftIndex(saved.activeIndex));
        if (saved.exportWithBackground !== undefined) {
          dispatch(setExportWithBackground(saved.exportWithBackground));
        }
      }
    }
  }, [memeDrafts.length, dispatch]);

  // 当 memeDrafts 或 exportWithBackground 更新时，同步到 localStorage
  useEffect(() => {
    if (memeDrafts.length > 0) {
      saveMemeDrafts(memeDrafts, activeDraftIndex, exportWithBackground);
    }
  }, [memeDrafts, activeDraftIndex, exportWithBackground]);

  const activeDraft = memeDrafts[activeDraftIndex];
  const pendingCount = memeDrafts.filter(
    (d) => d.status === "pending" || d.status === "error"
  ).length;
  // 检查是否所有表情包都已生成完成
  const allCompleted =
    memeDrafts.length > 0 &&
    memeDrafts.every((d) => d.status === "done" && d.generatedUrl);

  const GUEST_DAILY_LIMIT = 1; // 游客1次
  const FREE_DAILY_LIMIT = 5; // 普通用户5次
  const PREMIUM_DAILY_LIMIT = 50; // 会员50次

  const getLimit = () => {
    if (userTier === "PREMIUM") return PREMIUM_DAILY_LIMIT;
    if (userStatus === "LOGGED_IN") return FREE_DAILY_LIMIT;
    return GUEST_DAILY_LIMIT; // 游客
  };
  const isQuotaReached = (amount = 1) => {
    const today = getTodayDateString();
    const usageDate = normalizeDateString(memeUsage.date);
    if (usageDate !== today) return false;
    return memeUsage.count + amount > getLimit();
  };
  const remainingQuota = () => {
    const today = getTodayDateString();
    const usageDate = normalizeDateString(memeUsage.date);
    if (usageDate !== today) return getLimit();
    return Math.max(0, getLimit() - memeUsage.count);
  };

  // Animation Preview Class
  let animClass = "";
  if (activeDraft?.animation === AnimationType.SHAKE)
    animClass = "animate-shake";
  if (activeDraft?.animation === AnimationType.PULSE)
    animClass = "animate-pulse-fast";
  if (activeDraft?.animation === AnimationType.ZOOM) animClass = "animate-zoom";
  if (activeDraft?.animation === AnimationType.SPIN)
    animClass = "animate-spin-slow";

  const applyMoodPack = (packId: string) => {
    dispatch(setSelectedMoodPack(packId));
    if (packId === "custom") return;

    const pack = MOOD_PACKS.find((p) => p.id === packId);
    if (!pack) return;

    // 批量更新所有草稿
    memeDrafts.forEach((draft, idx) => {
      const moodItem = pack.items[idx % pack.items.length];
      dispatch(
        updateMemeDraft({
          index: idx,
          draft: {
            text: moodItem.text,
            moodPrompt: moodItem.prompt,
            status: "pending" as const,
          },
        })
      );
    });
  };

  const handleGenerateMemes = async () => {
    if (pendingCount === 0) return;

    // 先检查次数
    if (isQuotaReached(pendingCount)) {
      dispatch(setIsQuotaModalOpen(true));
      return;
    }

    // Update UI to generating
    memeDrafts.forEach((draft, idx) => {
      if (draft.status === "pending" || draft.status === "error") {
        dispatch(
          updateMemeDraft({ index: idx, draft: { status: "generating" } })
        );
      }
    });

    // Process one by one
    for (let i = 0; i < memeDrafts.length; i++) {
      const draft = memeDrafts[i];
      if (draft.status !== "pending" && draft.status !== "error") continue;

      try {
        const resultUrl = await generateSticker(
          draft.sourceUrl,
          draft.moodPrompt
        );
        dispatch(
          updateMemeDraft({
            index: i,
            draft: { generatedUrl: resultUrl, status: "done" },
          })
        );
        // 表情包生成成功，增加使用次数
        dispatch(updateMemeUsage(1));

        // 如果用户已登录，同步到后端
        if (userStatus === "LOGGED_IN" && userId) {
          try {
            const updatedUsage = await updateMemeUsageAPI(userId, 1);
            dispatch(setMemeUsage(updatedUsage));
          } catch (error) {
            console.error("Failed to sync meme usage to backend:", error);
          }
        }

        // 保存历史记录到数据库
        await saveHistory(
          "meme",
          resultUrl,
          draft.moodPrompt || draft.text,
          undefined
        );
      } catch (e) {
        dispatch(updateMemeDraft({ index: i, draft: { status: "error" } }));
      }
    }
  };

  const createGif = async (
    draft: typeof activeDraft,
    width = 240,
    height = 240,
    withBackground = true
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (draft.animation === AnimationType.NONE || !draft.generatedUrl) {
        resolve(draft.generatedUrl || "");
        return;
      }

      const frames: string[] = [];
      const numFrames = 10;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = draft.generatedUrl;

      img.onload = () => {
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const drawFrame = (frameIndex: number) => {
          ctx.clearRect(0, 0, width, height);
          // 根据选项设置背景色
          if (withBackground) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, width, height);
          }
          ctx.save();

          let scale = 1;
          let tx = 0;
          let rotate = 0;
          const t = frameIndex / numFrames;

          if (draft.animation === AnimationType.SHAKE) {
            const offset = 4;
            if (frameIndex % 2 === 0) {
              tx = offset;
              rotate = 2;
            } else {
              tx = -offset;
              rotate = -2;
            }
          } else if (draft.animation === AnimationType.PULSE) {
            scale = 1 + Math.sin(t * Math.PI * 2) * 0.1;
          } else if (draft.animation === AnimationType.ZOOM) {
            scale = 1 + t * 0.2;
          } else if (draft.animation === AnimationType.SPIN) {
            rotate = t * 360;
          }

          ctx.translate(width / 2, height / 2);
          ctx.rotate((rotate * Math.PI) / 180);
          ctx.scale(scale, scale);
          ctx.translate(-width / 2, -height / 2);

          const scaleFactor = Math.min(width / img.width, 200 / img.height);
          const w = img.width * scaleFactor;
          const h = img.height * scaleFactor;
          const x = (width - w) / 2;
          const y = (200 - h) / 2;

          ctx.drawImage(img, x, y, w, h);

          ctx.fillStyle = "white";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 4;
          ctx.strokeText(draft.text, 120, 220);
          ctx.fillText(draft.text, 120, 220);

          frames.push(canvas.toDataURL("image/png"));
        };

        for (let i = 0; i < numFrames; i++) {
          drawFrame(i);
        }

        if (typeof window.gifshot !== "undefined") {
          window.gifshot.createGIF(
            {
              images: frames,
              gifWidth: width,
              gifHeight: height,
              interval: 0.1,
              numFrames: numFrames,
            },
            (obj: any) => {
              if (!obj.error) {
                resolve(obj.image);
              } else {
                reject(obj.errorMsg);
              }
            }
          );
        } else {
          reject("gifshot library not loaded");
        }
      };
    });
  };

  const exportWeChatPackage = async () => {
    dispatch(setIsExporting(true));
    try {
      const zip = new JSZip();
      const completedDrafts = memeDrafts.filter(
        (d) => d.status === "done" && d.generatedUrl
      );

      if (completedDrafts.length === 0) {
        alert("没有可导出的表情包");
        dispatch(setIsExporting(false));
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 240;
      canvas.height = 240;

      for (let i = 0; i < completedDrafts.length; i++) {
        const draft = completedDrafts[i];
        if (draft.animation !== AnimationType.NONE) {
          try {
            const gifBase64 = await createGif(
              draft,
              240,
              240,
              exportWithBackground
            );
            const base64Data = gifBase64.split(",")[1];
            zip.file(`sticker_${i + 1}.gif`, base64Data, { base64: true });
          } catch (e) {
            console.error("GIF creation failed", e);
          }
        } else {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = draft.generatedUrl!;

          await new Promise((resolve) => {
            img.onload = () => {
              ctx.clearRect(0, 0, 240, 240);
              // 根据选项设置背景色
              if (exportWithBackground) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, 240, 240);
              }
              const scale = Math.min(240 / img.width, 200 / img.height);
              const w = img.width * scale;
              const h = img.height * scale;
              const x = (240 - w) / 2;
              const y = (200 - h) / 2;
              ctx.drawImage(img, x, y, w, h);
              ctx.font = "bold 24px sans-serif";
              ctx.textAlign = "center";
              ctx.fillStyle = "white";
              ctx.strokeStyle = "black";
              ctx.lineWidth = 4;
              ctx.strokeText(draft.text, 120, 220);
              ctx.fillText(draft.text, 120, 220);
              const dataUrl = canvas.toDataURL("image/png");
              const base64Data = dataUrl.split(",")[1];
              zip.file(`sticker_${i + 1}.png`, base64Data, { base64: true });
              resolve(null);
            };
          });
        }
      }

      zip.file(
        "README.txt",
        "这些表情包由 IP 创想坊 AI 生成。\nGIF 建议直接发送给文件助手再添加表情。"
      );
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `meme-pack-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed", e);
      alert("导出失败，请重试");
    } finally {
      dispatch(setIsExporting(false));
    }
  };

  // 如果没有草稿（且已尝试从 localStorage 加载），显示提示
  if (!activeDraft || memeDrafts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-gray-500">未找到表情包草稿</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 md:pt-16">
      <header className="bg-white px-4 md:hidden py-3 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center justify-between">
        <button
          onClick={() => router.push("/profile")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="font-bold text-lg text-gray-800">表情包工坊</h2>
        <div className="w-8"></div>
      </header>

      <div className="flex-1 p-6 md:p-12 space-y-6 overflow-y-auto max-w-6xl mx-auto w-full">
        {/* 额度显示 */}
        <div className="flex items-center justify-end mb-2">
          <div
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border ${
              isQuotaReached()
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-violet-50 text-violet-700 border-violet-200"
            }`}
          >
            <Zap size={16} fill="currentColor" />
            <span className="font-semibold">
              表情包：{remainingQuota()} / {getLimit()}
            </span>
          </div>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-8 md:items-start">
          {/* Left Column - Preview Area */}
          <div className="space-y-6">
            <div className="bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-100 p-6 md:p-8 flex flex-col items-center justify-center relative md:rounded-2xl md:shadow-sm">
              <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-white rounded-lg shadow-xl border-4 border-white relative flex items-center justify-center">
                <div
                  className={`w-full h-full relative overflow-hidden ${animClass}`}
                >
                  {activeDraft.generatedUrl ? (
                    <>
                      <img
                        src={activeDraft.generatedUrl}
                        className="w-full h-full object-contain p-4"
                      />
                      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                        <span
                          className="text-2xl font-bold text-white stroke-black drop-shadow-md"
                          style={{
                            textShadow:
                              "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                          }}
                        >
                          {activeDraft.text}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4 opacity-50">
                      <img
                        src={activeDraft.sourceUrl}
                        className="w-full h-full object-contain opacity-30 blur-sm"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs">
                          等待生成
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {activeDraft.status === "generating" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-md">
                    <Loader message="" />
                  </div>
                )}
              </div>
              {memeDrafts.length > 1 && (
                <div className="mt-6 flex gap-2 overflow-x-auto max-w-full p-2 bg-white/50 rounded-xl backdrop-blur-md md:flex-wrap md:justify-center">
                  {memeDrafts.map((draft, idx) => (
                    <div
                      key={draft.id}
                      onClick={() => dispatch(setActiveDraftIndex(idx))}
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 flex-shrink-0 overflow-hidden cursor-pointer relative transition-all hover:scale-105 ${
                        idx === activeDraftIndex
                          ? "border-violet-600 ring-2 ring-violet-200"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={draft.generatedUrl || draft.sourceUrl}
                        className="w-full h-full object-cover"
                      />
                      {draft.status === "done" && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
                <Smile size={16} className="text-violet-500" /> 情绪套餐
              </label>
              <div className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-x-visible pb-2 no-scrollbar">
                {MOOD_PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => applyMoodPack(pack.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedMoodPack === pack.id
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-amber-200 hover:bg-gray-50"
                    }`}
                  >
                    {pack.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
                <Play size={16} className="text-violet-500" /> 动态特效
              </label>
              <div className="flex gap-2 flex-wrap">
                {ANIMATION_OPTIONS.map((anim) => (
                  <button
                    key={anim.id}
                    onClick={() => {
                      dispatch(
                        updateMemeDraft({
                          index: activeDraftIndex,
                          draft: { animation: anim.id },
                        })
                      );
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 border transition-colors whitespace-nowrap ${
                      activeDraft.animation === anim.id
                        ? "bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-200"
                        : "bg-white border-gray-200 text-gray-600 hover:border-violet-200 hover:bg-gray-50"
                    }`}
                  >
                    {anim.icon}
                    {anim.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
                <Layers size={16} className="text-violet-500" /> 表情文案
              </label>
              <input
                type="text"
                value={activeDraft.text}
                onChange={(e) => {
                  dispatch(
                    updateMemeDraft({
                      index: activeDraftIndex,
                      draft: { text: e.target.value },
                    })
                  );
                }}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-gray-700 shadow-sm text-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
                <Wand2 size={16} className="text-violet-500" /> 动作指令
              </label>
              <input
                type="text"
                value={activeDraft.moodPrompt}
                placeholder="例如：大笑、挥手"
                onChange={(e) => {
                  dispatch(
                    updateMemeDraft({
                      index: activeDraftIndex,
                      draft: {
                        moodPrompt: e.target.value,
                        status: "pending",
                      },
                    })
                  );
                }}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-gray-700 shadow-sm text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 pb-4 pt-2 bg-gradient-to-t from-gray-50 to-transparent max-w-6xl mx-auto w-full">
        {pendingCount > 0 ? (
          <>
            <button
              onClick={handleGenerateMemes}
              disabled={isQuotaReached(pendingCount)}
              className={`w-full py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isQuotaReached(pendingCount)
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-violet-600 text-white shadow-violet-200 hover:bg-violet-700"
              }`}
            >
              <Wand2 size={18} />
              {isQuotaReached(pendingCount)
                ? "表情包制作额度已用完"
                : memeDrafts.length > 1
                ? `生成全部 (${pendingCount})`
                : "生成表情"}
            </button>
            {isQuotaReached(pendingCount) && (
              <p
                onClick={() => dispatch(setIsPaymentModalOpen(true))}
                className="text-center text-xs text-violet-600 mt-2 cursor-pointer hover:underline"
              >
                升级会员获取更多表情包制作额度 &rarr;
              </p>
            )}
          </>
        ) : (
          <div className="space-y-3">
            {/* 背景色选项 */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  导出时保留背景色
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportWithBackground}
                  onChange={(e) =>
                    dispatch(setExportWithBackground(e.target.checked))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>
            <button
              onClick={exportWeChatPackage}
              disabled={isExporting || !allCompleted}
              className={`w-full py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isExporting || !allCompleted
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-500 text-white shadow-green-200 hover:bg-green-600"
              }`}
              title={!allCompleted ? "请等待所有表情包生成完成" : ""}
            >
              {isExporting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Package size={18} />
              )}
              {!allCompleted
                ? memeDrafts.length > 1
                  ? "生成中，请稍候..."
                  : "生成中，请稍候..."
                : memeDrafts.length > 1
                ? "导出表情包 (ZIP)"
                : "保存表情"}
            </button>
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
        type="meme"
      />
    </div>
  );
}
