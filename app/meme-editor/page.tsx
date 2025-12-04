"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  Package,
  Loader2,
  Activity,
  Zap,
  Download,
  ImageIcon,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setMemeDrafts,
  updateMemeDraft,
  setActiveDraftIndex,
  setSelectedMoodPack,
  setIsExporting,
} from "@/store/slices/memeSlice";
import {
  updateMemeUsage,
  setMemeUsage,
  setUserTier,
  setMembershipExpiresAt,
} from "@/store/slices/userSlice";
import {
  updateMemeUsage as updateMemeUsageAPI,
  getUserInfo,
} from "@/services/userService";
import { saveHistory } from "@/services/historyService";
import {
  setIsPaymentModalOpen,
  setIsQuotaModalOpen,
} from "@/store/slices/appSlice";
import { UserTier, MemeDraft } from "@/types";
import { getMembershipPlan } from "@/lib/membership";
import { generateSticker } from "@/services/geminiService";
import { MOOD_PACKS } from "@/lib/constants";
import { getTodayDateString, normalizeDateString } from "@/lib/date-utils";
import { AnimationType } from "@/types";
import Loader from "@/components/Loader";
import PaymentModal from "@/components/PaymentModal";
import QuotaModal from "@/components/QuotaModal";
import { getProxiedImageUrl } from "@/lib/image-storage";
import MemePreview from "@/components/meme-editor/MemePreview";
import QuotaDisplay from "@/components/meme-editor/QuotaDisplay";
import TextPromptGroups from "@/components/meme-editor/TextPromptGroups";
import AnimationSelector from "@/components/meme-editor/AnimationSelector";
import BackgroundRemovalControls from "@/components/meme-editor/BackgroundRemovalControls";
import DraftThumbnails from "@/components/meme-editor/DraftThumbnails";
import GroupThumbnails from "@/components/meme-editor/GroupThumbnails";
import GenerateButton from "@/components/meme-editor/GenerateButton";
import { useQuota } from "@/hooks/useQuota";
import { useTextPrompts } from "@/hooks/useTextPrompts";
import { useMemePreview } from "@/hooks/useMemePreview";
import { useMemeFileUpload } from "@/hooks/useMemeFileUpload";
import { useMemeGeneration } from "@/hooks/useMemeGeneration";
import { useMemeExport } from "@/hooks/useMemeExport";
import { useFFmpeg } from "@/hooks/useFFmpeg";

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
  const memeUsage = useAppSelector((state) => state.user.memeUsage);
  const userStatus = useAppSelector((state) => state.user.status);
  const userId = useAppSelector((state) => state.user.userId);
  const userTier = useAppSelector((state) => state.user.userTier);
  const membershipExpiresAt = useAppSelector(
    (state) => state.user.membershipExpiresAt
  );

  // Use quota hook
  // const quota = useQuota("meme");
  const isPaymentModalOpen = useAppSelector(
    (state) => state.app.isPaymentModalOpen
  );
  const isQuotaModalOpen = useAppSelector(
    (state) => state.app.isQuotaModalOpen
  );
  const initializedRef = useRef(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const [isProcessingBackground, setIsProcessingBackground] = useState(false);
  const processedImageRef = useRef<{ [key: string]: string }>({});

  // Use FFmpeg hook
  // const { initFFmpeg } = useFFmpeg();
  // 管理情绪套餐下拉菜单的显示状态：{ groupIndex: boolean } 或 'single' 表示单分组模式
  const [moodPackMenuOpen, setMoodPackMenuOpen] = useState<
    number | "single" | null
  >(null);
  const moodPackMenuRefs = useRef<Map<number | "single", HTMLDivElement>>(
    new Map()
  );

  // 点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moodPackMenuOpen === null) return;

      const target = event.target as Node;
      const menuElement = moodPackMenuRefs.current.get(moodPackMenuOpen);

      if (menuElement && !menuElement.contains(target)) {
        setMoodPackMenuOpen(null);
      }
    };

    if (moodPackMenuOpen !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [moodPackMenuOpen]);

  const activeDraft = memeDrafts[activeDraftIndex];

  // Use text prompts hook
  const { getTextPrompts, updateTextPrompts, textPromptsRef } = useTextPrompts(
    activeDraft,
    activeDraftIndex
  );

  // 获取当前草稿的分组结果（从 Redux 中读取，类似多场景页面）
  const getGroupResults = useCallback(
    (draft: typeof activeDraft) => {
      if (!draft) return [];
      const prompts = getTextPrompts(draft);
      // 如果草稿中有 groupResults，直接使用；否则返回初始值（不在这里更新 Redux）
      if (draft.groupResults && draft.groupResults.length === prompts.length) {
        return draft.groupResults;
      }
      // 返回初始值，但不更新 Redux（避免在渲染时调用 dispatch）
      return prompts.map(() => ({
        generatedUrl: null,
        status: "pending" as const,
      }));
    },
    [getTextPrompts]
  );

  // 在 useEffect 中初始化分组结果（避免在渲染时调用 dispatch）
  useEffect(() => {
    if (!activeDraft) return;
    const prompts = getTextPrompts(activeDraft);
    if (prompts.length > 1) {
      // 如果还没有 groupResults 或长度不匹配，初始化
      if (
        !activeDraft.groupResults ||
        activeDraft.groupResults.length !== prompts.length
      ) {
        const existingResults = activeDraft.groupResults || [];

        // 尝试从单分组模式迁移数据
        let firstResult = existingResults[0];
        if (!firstResult && existingResults.length === 0) {
          // 如果之前是单分组，且有生成结果，迁移到第一个分组
          if (activeDraft.generatedUrl) {
            firstResult = {
              generatedUrl: activeDraft.generatedUrl,
              status: activeDraft.status || "done",
            };
          } else if (activeDraft.status === "pending") {
            // 如果是 pending 状态
            firstResult = {
              generatedUrl: null,
              status: "pending",
            };
          }
        }

        const newResults = prompts.map((_, index) => {
          // 第一个分组，如果有迁移数据，使用迁移数据
          if (index === 0 && firstResult) return firstResult;
          // 其他已存在的分组，保留原有数据
          if (index < existingResults.length) return existingResults[index];
          // 新增的分组，初始化为 pending
          return {
            generatedUrl: null,
            status: "pending" as const,
          };
        });

        dispatch(
          updateMemeDraft({
            index: activeDraftIndex,
            draft: { groupResults: newResults },
          })
        );
      }
    }
  }, [activeDraft?.id, activeDraftIndex, dispatch, getTextPrompts]); // 注意：activeDraft 本身变化时会触发，所以这里逻辑必须是幂等的或者有条件判断

  // 当前选中的分组索引（用于预览）
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

  // 当切换草稿时，重置分组索引
  useEffect(() => {
    setActiveGroupIndex(0);
  }, [activeDraftIndex]);

  // 检查是否选择了情绪套餐（排除 custom）
  const hasSelectedMoodPack =
    selectedMoodPack.filter((id) => id !== "custom").length > 0;

  // 当切换草稿时，确保分组数据已初始化
  useEffect(() => {
    if (activeDraft) {
      getTextPrompts(activeDraft);
    }
  }, [activeDraft?.id, getTextPrompts]);

  // Removed initFFmpeg - now using useFFmpeg hook

  // 页面初始化
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    setIsInitializing(false);

    // FFmpeg 会在需要时自动初始化（在 generatePreview 中），不需要在这里预加载
  }, []);

  // 同步用户额度（只在 Redux 中没有用户信息时才从后端获取）
  // 注意：SSR 已经在 layout.tsx 中初始化了用户信息，所以这里不需要每次都调用
  const hasSyncedRef = useRef(false);
  useEffect(() => {
    const syncUserQuota = async () => {
      // 如果已经同步过，或者 Redux 中已经有用户信息，就不需要再次同步
      if (
        hasSyncedRef.current ||
        (userStatus === "LOGGED_IN" && userId && memeUsage)
      ) {
        return;
      }

      if (userStatus === "LOGGED_IN" && userId) {
        hasSyncedRef.current = true;
        try {
          const userInfo = await getUserInfo(userId);
          // 更新 Redux store 中的额度
          if (userInfo.memeUsage) {
            dispatch(setMemeUsage(userInfo.memeUsage));
          }
          if (userInfo.userTier) {
            dispatch(setUserTier(userInfo.userTier));
          }
          if (userInfo.membershipExpiresAt !== undefined) {
            dispatch(setMembershipExpiresAt(userInfo.membershipExpiresAt));
          }
        } catch (error) {
          console.error("Failed to sync user quota:", error);
          hasSyncedRef.current = false; // 失败时允许重试
        }
      }
    };

    syncUserQuota();
  }, [userStatus, userId, dispatch, memeUsage]);

  // Use file upload hook
  const { fileInputRef, handleFileChange, triggerFileInput } =
    useMemeFileUpload();

  // Use preview hook
  const { previewGif, isGeneratingPreview, generatePreview, setPreviewGif } =
    useMemePreview(processedImageRef);

  // Auto generate preview when relevant properties change
  // 使用 ref 存储最新的 draft 和函数，避免依赖变化导致循环触发
  const previewDraftRef = useRef(activeDraft);
  const generatePreviewRef = useRef(generatePreview);
  const setPreviewGifRef = useRef(setPreviewGif);

  // 更新 ref
  useEffect(() => {
    previewDraftRef.current = activeDraft;
    generatePreviewRef.current = generatePreview;
    setPreviewGifRef.current = setPreviewGif;
  }, [activeDraft, generatePreview, setPreviewGif]);

  useEffect(() => {
    const draft = previewDraftRef.current;
    if (
      (!draft?.generatedUrl && !draft?.sourceUrl) ||
      draft.animation === AnimationType.NONE
    ) {
      setPreviewGifRef.current(null);
      return;
    }

    const timer = setTimeout(() => {
      // 构造用于预览的 draft 对象
      // 如果是多分组模式，需要使用当前选中的分组数据
      const prompts = getTextPrompts(draft);
      let previewDraft = { ...draft };

      if (prompts.length > 1) {
        const groupResults = getGroupResults(draft);
        const groupResult = groupResults[activeGroupIndex];
        const prompt = prompts[activeGroupIndex];

        if (groupResult) {
          previewDraft.generatedUrl =
            groupResult.generatedUrl || draft.sourceUrl;
          // 注意：如果 status 是 error，可能需要处理，但这里我们只关心是否有 url 用于预览
        }

        if (prompt) {
          previewDraft.text = prompt.text;
          previewDraft.textPosition = prompt.textPosition;
        }
      }

      generatePreviewRef.current(previewDraft);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    activeDraft?.generatedUrl,
    activeDraft?.sourceUrl,
    activeDraft?.animation,
    activeDraft?.backgroundType,
    activeDraft?.backgroundColor,
    activeGroupIndex, // 添加 activeGroupIndex 依赖
  ]);

  // 移除自动处理逻辑：擦除背景只在生成时根据状态决定是否调用接口
  const pendingCount = memeDrafts.reduce((count, draft) => {
    const prompts = getTextPrompts(draft);
    if (prompts.length > 1 && draft.groupResults) {
      // 多分组：计算 groupResults 中 pending 的数量
      const pendingGroups = draft.groupResults.filter(
        (r) => r.status === "pending"
      ).length;
      // 如果 prompts 数量多于 groupResults，说明有新增的分组也是 pending
      const extraPrompts = Math.max(
        0,
        prompts.length - draft.groupResults.length
      );
      return count + pendingGroups + extraPrompts;
    } else {
      // 单分组
      return (
        count + (draft.status === "pending" || draft.status === "error" ? 1 : 0)
      );
    }
  }, 0);

  // 检查是否有任何表情包正在生成中
  const isGenerating = memeDrafts.some((d) => {
    const prompts = getTextPrompts(d);
    if (prompts.length > 1 && d.groupResults) {
      return d.groupResults.some((r) => r.status === "generating");
    }
    return d.status === "generating";
  });

  // 检查是否所有表情包都已生成完成（无论成功还是失败，只要不是 pending 或 generating）
  const allCompleted = useMemo(() => {
    if (memeDrafts.length === 0) return false;
    // 只要没有正在生成且没有等待生成的，就算完成
    return !isGenerating && pendingCount === 0;
  }, [memeDrafts, isGenerating, pendingCount]);

  // 检查是否有错误状态
  const hasError = useMemo(() => {
    return memeDrafts.some((draft) => {
      const prompts = getTextPrompts(draft);
      if (prompts.length > 1 && draft.groupResults) {
        return draft.groupResults.some((r) => r.status === "error");
      }
      return draft.status === "error";
    });
  }, [memeDrafts, getTextPrompts]);

  // 检查是否所有都失败了
  const allFailed = useMemo(() => {
    if (memeDrafts.length === 0) return false;
    return memeDrafts.every((draft) => {
      const prompts = getTextPrompts(draft);
      if (prompts.length > 1 && draft.groupResults) {
        // 多分组：所有分组都失败才算全部失败
        return (
          draft.groupResults.length > 0 &&
          draft.groupResults.every((r) => r.status === "error")
        );
      }
      return draft.status === "error";
    });
  }, [memeDrafts, getTextPrompts]);

  const GUEST_DAILY_LIMIT = 1; // 游客1次
  const FREE_DAILY_LIMIT = 5; // 普通用户5次

  // 检查是否为会员（包括所有付费会员等级）
  const isPremium = useMemo(() => {
    return [UserTier.BASIC, UserTier.STANDARD, UserTier.PREMIUM].includes(
      userTier
    );
  }, [userTier]);

  // 检查会员是否过期（使用 useMemo 避免 SSR 问题）
  const isMembershipValid = useMemo(() => {
    if (!isPremium || !membershipExpiresAt) {
      return false;
    }
    // 在 SSR 时，Date.now() 可能不可用，使用安全的检查
    if (typeof window === "undefined") {
      // SSR 时，假设会员有效（会在客户端重新计算）
      return true;
    }
    return membershipExpiresAt > Date.now();
  }, [isPremium, membershipExpiresAt]);

  // 获取会员计划信息（使用 useMemo 缓存）
  const membershipPlan = useMemo(() => {
    if (isMembershipValid && userTier !== UserTier.FREE) {
      return getMembershipPlan(userTier);
    }
    return null;
  }, [isMembershipValid, userTier]);

  const getLimit = () => {
    // 如果是有效会员，使用会员计划的月度额度
    if (isMembershipValid && membershipPlan) {
      return membershipPlan.memeQuota;
    }
    // 如果是已登录用户，使用免费额度
    if (userStatus === "LOGGED_IN") {
      return FREE_DAILY_LIMIT;
    }
    // 游客
    return GUEST_DAILY_LIMIT;
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

  // Removed handleFileChange and triggerFileInput - now using useMemeFileUpload hook

  // 处理擦除背景开关变化
  const handleBackgroundRemovalToggle = async (checked: boolean) => {
    if (!activeDraft) return;

    // 只更新状态，不调用接口
    // 接口调用会在生成时根据这个状态来决定
    dispatch(
      updateMemeDraft({
        index: activeDraftIndex,
        draft: { removeBackground: checked },
      })
    );

    // 如果有动效且已生成图片，切换开关后自动重新生成预览 GIF
    if (
      activeDraft.animation !== AnimationType.NONE &&
      activeDraft.generatedUrl
    ) {
      console.log("有动效，重新生成预览 GIF");
      try {
        await generatePreview(activeDraft);
      } catch (previewError) {
        console.error("重新生成预览失败:", previewError);
        // 预览生成失败不影响主流程
      }
    }
  };

  // 添加情绪套餐到指定分组
  const applyMoodPackToGroup = (
    packId: string,
    groupIndex: number | "single"
  ) => {
    if (!activeDraft) return;

    const pack = MOOD_PACKS.find((p) => p.id === packId);
    if (!pack || pack.id === "custom" || pack.items.length === 0) return;

    // 随机选择一个item（或者使用第一个）
    const moodItem = pack.items[Math.floor(Math.random() * pack.items.length)];

    if (groupIndex === "single") {
      // 单分组模式：直接更新 text 和 moodPrompt
      dispatch(
        updateMemeDraft({
          index: activeDraftIndex,
          draft: {
            text: moodItem.text,
            moodPrompt: moodItem.prompt,
          },
        })
      );
    } else {
      // 多分组模式：更新指定分组
      const prompts = getTextPrompts(activeDraft);
      if (prompts[groupIndex]) {
        prompts[groupIndex].text = moodItem.text;
        prompts[groupIndex].moodPrompt = moodItem.prompt;
        updateTextPrompts(prompts, activeDraft.id);
      }
    }

    // 关闭下拉菜单
    setMoodPackMenuOpen(null);
  };

  const applyMoodPack = (packId: string) => {
    // 如果选择 custom，切换 custom 的选中状态（与其他选项互斥）
    if (packId === "custom") {
      const isCustomSelected = selectedMoodPack.includes("custom");
      if (isCustomSelected) {
        // 如果已经选中，取消选中
        dispatch(setSelectedMoodPack([]));
        // 清空分组
        memeDrafts.forEach((draft, idx) => {
          textPromptsRef.current[draft.id] = [];
          dispatch(
            updateMemeDraft({
              index: idx,
              draft: {
                text: "",
                moodPrompt: "",
                status: "pending" as const,
              },
            })
          );
        });
      } else {
        // 如果未选中，选中 custom 并清空其他选择（互斥）
        dispatch(setSelectedMoodPack(["custom"]));
        // 清空分组
        memeDrafts.forEach((draft, idx) => {
          textPromptsRef.current[draft.id] = [];
          dispatch(
            updateMemeDraft({
              index: idx,
              draft: {
                text: "",
                moodPrompt: "",
                status: "pending" as const,
              },
            })
          );
        });
      }
      return;
    }

    // 选择其他选项时，确保与 custom 互斥
    // 如果 custom 已选中，先移除它
    const currentSelectedPacks = selectedMoodPack.filter(
      (id) => id !== "custom"
    );

    // 计算新的选择状态（在 dispatch 之前）
    const isCurrentlySelected = currentSelectedPacks.includes(packId);

    // 如果当前未选中，且已经选择了5个套餐，则不允许再选择
    if (!isCurrentlySelected && currentSelectedPacks.length >= 5) {
      alert("最多只能选择5个情绪套餐");
      return;
    }

    // 构建新的选择列表（确保不包含 custom，实现互斥）
    const newSelected = isCurrentlySelected
      ? currentSelectedPacks.filter((id) => id !== packId)
      : [...currentSelectedPacks, packId];

    // 切换选择状态（确保不包含 custom，实现互斥）
    dispatch(setSelectedMoodPack(newSelected));

    // 过滤掉 custom，只处理实际的套餐
    const selectedPacks = newSelected.filter((id) => id !== "custom");

    if (selectedPacks.length === 0) {
      // 如果没有选择任何套餐，清空分组
      memeDrafts.forEach((draft, idx) => {
        textPromptsRef.current[draft.id] = [];
        dispatch(
          updateMemeDraft({
            index: idx,
            draft: {
              text: "",
              moodPrompt: "",
              status: "pending" as const,
            },
          })
        );
      });
      return;
    }

    // 批量更新所有草稿
    memeDrafts.forEach((draft, idx) => {
      // 获取当前已有的分组（包括用户手动添加的自定义分组）
      const existingPrompts = getTextPrompts(draft);
      // 计算操作前的情绪套餐数量（用于识别哪些是自定义分组）
      // 假设前 N 个分组是来自情绪套餐的，N 个之后的是用户手动添加的自定义分组
      // 使用操作前的 currentSelectedPacks.length 来识别自定义分组
      const previousMoodPackCount = currentSelectedPacks.length;
      // 保留在操作前的情绪套餐数量之后的所有分组作为自定义分组
      const customPrompts = existingPrompts.slice(previousMoodPackCount);

      if (selectedPacks.length === 1) {
        // 只选择1个套餐时，不创建分组，直接更新 text 和 moodPrompt
        const pack = MOOD_PACKS.find((p) => p.id === selectedPacks[0]);
        if (pack && pack.items.length > 0) {
          const moodItem = pack.items[idx % pack.items.length];
          // 清空分组（但保留自定义分组）
          textPromptsRef.current[draft.id] = customPrompts;
          // 直接更新 text 和 moodPrompt
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
        }
      } else {
        // 选择2个或以上套餐时，创建分组（最多5个）
        const prompts: Array<{
          text: string;
          moodPrompt: string;
          textPosition?: "top" | "bottom";
        }> = [];
        const maxGroups = Math.min(selectedPacks.length, 5);

        for (let i = 0; i < maxGroups; i++) {
          const selectedPackId = selectedPacks[i];
          const pack = MOOD_PACKS.find((p) => p.id === selectedPackId);
          if (!pack || pack.items.length === 0) continue;

          const moodItem = pack.items[idx % pack.items.length];
          prompts.push({
            text: moodItem.text,
            moodPrompt: moodItem.prompt,
            textPosition: "bottom", // 默认下方
          });
        }

        // 保留用户手动添加的自定义分组（在情绪套餐分组之后）
        const allPrompts = [...prompts, ...customPrompts];

        // 更新分组缓存
        textPromptsRef.current[draft.id] = allPrompts;

        // 更新Redux store（使用第一个分组的数据作为默认值）
        const firstPrompt = prompts[0] || { text: "", moodPrompt: "" };

        // 预初始化 groupResults 和 prompts
        const initialGroupResults = allPrompts.map(() => ({
          generatedUrl: null,
          status: "pending" as const,
        }));

        dispatch(
          updateMemeDraft({
            index: idx,
            draft: {
              text: firstPrompt.text,
              moodPrompt: firstPrompt.moodPrompt,
              textPosition: firstPrompt.textPosition,
              status: "pending" as const,
              groupResults: initialGroupResults,
              prompts: allPrompts,
            },
          })
        );
      }
    });
  };

  // Use generation hook
  const { generateMemes: handleGenerateMemes, retryGroup: handleRetryGroup } =
    useMemeGeneration({
      memeDrafts,
      getTextPrompts,
      getGroupResults,
      processedImageRef,
      isQuotaReached: (amount = 1) => {
        const today = getTodayDateString();
        const usageDate = normalizeDateString(memeUsage.date);
        if (usageDate !== today) return false;
        return memeUsage.count + amount > getLimit();
      },
      setIsQuotaModalOpen: (open: boolean) =>
        dispatch(setIsQuotaModalOpen(open)),
      setIsProcessingBackground,
      textPromptsRef, // 传递 textPromptsRef 以便直接访问数据
    });

  // Use export hook
  const { exportWeChatPackage } = useMemeExport({
    memeDrafts,
    getTextPrompts,
    processedImageRef,
  });

  // Removed handleGenerateMemesLegacy - now using useMemeGeneration hook

  // Removed createGif - now using createGifWithFFmpeg from utils/gif-utils.ts
  // This function is handled by useMemePreview hook

  // Removed createFinalImageWithText - now using createFinalImageWithText from utils/image-utils.ts
  // This function is handled by useMemeGeneration and useMemeExport hooks

  // Removed exportWeChatPackage - now using useMemeExport hook

  // 如果还在初始化，显示加载状态
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // 如果没有草稿，显示空状态
  if (!activeDraft || memeDrafts.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 pb-24 md:pt-16">
        <header className="bg-white px-4 md:hidden py-3 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center justify-between">
          <button
            onClick={() => router.push("/create")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="font-bold text-lg text-gray-800">表情包工坊</h2>
          <div className="w-8"></div>
        </header>

        <div className="flex-1 p-6 md:p-12 flex items-center justify-center max-w-6xl mx-auto w-full">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div
                onClick={triggerFileInput}
                className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-violet-50 hover:border-violet-400 transition-all group"
              >
                <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  还没有表情包草稿
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  点击上传图片开始制作表情包
                </p>
                <p className="text-xs text-gray-400">
                  支持 JPG, PNG (最大 5MB)
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
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

      <div className="flex-1 p-6 md:p-12 space-y-6 max-w-6xl mx-auto w-full">
        {/* 额度显示和下载按钮 */}
        <div className="flex items-center justify-between mb-2">
          {/* 额度显示 */}
          <QuotaDisplay
            remaining={remainingQuota()}
            limit={getLimit()}
            isReached={isQuotaReached()}
          />
          {/* 下载按钮（在有至少1个完成的表情包时显示） */}
          {(() => {
            // 计算所有完成的表情包数量（包括单分组和多分组）
            let completedCount = 0;
            memeDrafts.forEach((d) => {
              const prompts = getTextPrompts(d);
              if (prompts.length > 1 && d.groupResults) {
                // 多分组：统计 groupResults 中状态为 "done" 且有 generatedUrl 的数量
                completedCount += d.groupResults.filter(
                  (r) => r.status === "done" && r.generatedUrl
                ).length;
              } else {
                // 单分组：检查主草稿状态
                if (d.status === "done" && d.generatedUrl) {
                  completedCount += 1;
                }
              }
            });
            return completedCount >= 1 ? (
              <button
                onClick={exportWeChatPackage}
                disabled={isExporting}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isExporting
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-violet-600 text-white hover:bg-violet-700"
                }`}
              >
                {isExporting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Download size={16} />
                )}
                {isExporting
                  ? "打包下载中..."
                  : completedCount === 1
                  ? "下载表情包"
                  : `批量下载所有表情包 (${completedCount} 张)`}
              </button>
            ) : null;
          })()}
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-8 md:items-start">
          {/* Left Column - Preview Area */}
          <div
            className="space-y-6 md:sticky md:top-20 md:self-start"
            style={{
              transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
            }}
          >
            {/* 原图展示区域 - 只在有生成结果时显示 */}
            {(() => {
              if (!activeDraft?.sourceUrl) return null;

              // 检查是否有生成结果
              const prompts = getTextPrompts(activeDraft);
              let hasGeneratedResult = false;

              if (prompts.length > 1) {
                // 多分组：检查当前选中分组是否有生成结果
                const groupResults = getGroupResults(activeDraft);
                const groupResult = groupResults[activeGroupIndex];
                hasGeneratedResult = !!groupResult?.generatedUrl;
              } else {
                // 单分组：检查主草稿是否有生成结果
                hasGeneratedResult = !!(
                  activeDraft.generatedUrl &&
                  activeDraft.sourceUrl !== activeDraft.generatedUrl
                );
              }

              // 只有在有生成结果时才显示原图
              return hasGeneratedResult ? (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      原图
                    </span>
                  </div>
                  <img
                    src={getProxiedImageUrl(activeDraft.sourceUrl)}
                    alt="Original Image"
                    className="w-full h-32 md:h-40 object-contain bg-gray-100 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      window.open(
                        getProxiedImageUrl(activeDraft.sourceUrl),
                        "_blank"
                      );
                    }}
                  />
                </div>
              ) : null;
            })()}

            <div className="bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-100 p-6 md:p-8 flex flex-col items-center justify-center relative md:rounded-2xl md:shadow-sm">
              <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-white rounded-lg shadow-xl border-4 border-white relative flex items-center justify-center">
                <div className="w-full h-full relative overflow-hidden bg-white">
                  {isGeneratingPreview ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 relative">
                      <Loader2
                        className="animate-spin text-violet-500"
                        size={32}
                      />
                      <span className="text-sm text-gray-600">
                        正在生成预览...
                      </span>
                    </div>
                  ) : activeDraft?.generatedUrl || activeDraft?.sourceUrl ? (
                    <>
                      {previewGif &&
                      (activeDraft.animation !== AnimationType.NONE ||
                        memeDrafts[activeDraftIndex]?.animation !==
                          AnimationType.NONE) ? (
                        <div className="w-full h-full bg-white flex items-center justify-center">
                          <img
                            key={`preview-${
                              activeDraft.animation
                            }-${Date.now()}`}
                            src={previewGif}
                            alt="Preview"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              console.error("预览 GIF 加载失败:", e);
                              setPreviewGif(null);
                            }}
                            onLoad={() => {
                              console.log("预览 GIF 加载成功");
                            }}
                          />
                        </div>
                      ) : (
                        <>
                          {(() => {
                            const prompts = getTextPrompts(activeDraft);
                            let imageUrl: string | null = null;

                            if (prompts.length > 1) {
                              // 多分组：使用选中分组的生成结果
                              const groupResults = getGroupResults(activeDraft);
                              const groupResult =
                                groupResults[activeGroupIndex];
                              if (groupResult?.generatedUrl) {
                                imageUrl = groupResult.generatedUrl;
                              } else if (activeDraft.sourceUrl) {
                                // 如果没有生成结果，显示原图
                                imageUrl = activeDraft.sourceUrl;
                              }
                            } else {
                              // 单分组：使用原有逻辑
                              if (
                                activeDraft.status === "done" &&
                                activeDraft.generatedUrl
                              ) {
                                imageUrl = activeDraft.generatedUrl;
                              } else if (
                                activeDraft.removeBackground &&
                                processedImageRef.current[activeDraft.id]
                              ) {
                                imageUrl =
                                  processedImageRef.current[activeDraft.id];
                              } else if (activeDraft.generatedUrl) {
                                imageUrl = activeDraft.generatedUrl;
                              } else if (activeDraft.sourceUrl) {
                                imageUrl = activeDraft.sourceUrl;
                              }
                            }

                            if (!imageUrl) {
                              return (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="text-center p-4">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                                      <Package className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      暂无图片
                                    </span>
                                  </div>
                                </div>
                              );
                            }

                            // 检查图片是否已经包含文字（generatedUrl 已经通过 createFinalImageWithText 添加了文字）
                            const hasGeneratedResult = (() => {
                              if (prompts.length > 1) {
                                const groupResults =
                                  getGroupResults(activeDraft);
                                const groupResult =
                                  groupResults[activeGroupIndex];
                                return (
                                  groupResult?.generatedUrl &&
                                  groupResult.status === "done"
                                );
                              } else {
                                return (
                                  activeDraft.status === "done" &&
                                  activeDraft.generatedUrl
                                );
                              }
                            })();

                            return (
                              <>
                                <img
                                  src={getProxiedImageUrl(imageUrl)}
                                  className="w-full h-full object-contain p-4"
                                  alt="Preview"
                                  onError={(e) => {
                                    console.error("预览图加载失败:", e);
                                  }}
                                />
                                {/* 只有在图片还没有生成完成时才显示文字覆盖层 */}
                                {!hasGeneratedResult && (
                                  <div
                                    className={`absolute left-0 right-0 text-center pointer-events-none ${(() => {
                                      const prompts =
                                        getTextPrompts(activeDraft);
                                      // 多分组模式：使用当前选中分组的 textPosition
                                      // 单分组模式：使用草稿的 textPosition
                                      const textPosition =
                                        prompts.length > 1
                                          ? prompts[activeGroupIndex]
                                              ?.textPosition ||
                                            activeDraft.textPosition ||
                                            "bottom"
                                          : activeDraft.textPosition ||
                                            "bottom";
                                      return textPosition === "top"
                                        ? "top-4"
                                        : "bottom-4";
                                    })()}`}
                                  >
                                    <span
                                      className="text-2xl font-bold text-white stroke-black drop-shadow-md"
                                      style={{
                                        textShadow:
                                          "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                                      }}
                                    >
                                      {(() => {
                                        const prompts =
                                          getTextPrompts(activeDraft);
                                        if (prompts.length > 1) {
                                          return (
                                            prompts[activeGroupIndex]?.text ||
                                            activeDraft.text ||
                                            ""
                                          );
                                        }
                                        return activeDraft.text || "";
                                      })()}
                                    </span>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </>
                      )}
                    </>
                  ) : activeDraft?.sourceUrl ? (
                    <div className="text-center p-4 opacity-50">
                      <img
                        src={getProxiedImageUrl(activeDraft.sourceUrl)}
                        className="w-full h-full object-contain opacity-30 blur-sm"
                        alt="等待生成"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs">
                          等待生成
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-500">暂无图片</span>
                      </div>
                    </div>
                  )}
                </div>
                {/* 擦除背景状态显示 - 只在没有动态图时显示 */}
                {isProcessingBackground && !previewGif && (
                  <div className="absolute inset-0 z-20 rounded-md overflow-hidden">
                    {/* 模糊的原图作为背景 */}
                    <img
                      src={getProxiedImageUrl(
                        (() => {
                          const prompts = getTextPrompts(activeDraft);
                          if (prompts.length > 1) {
                            const groupResults = getGroupResults(activeDraft);
                            const groupResult = groupResults[activeGroupIndex];
                            if (groupResult?.generatedUrl) {
                              return groupResult.generatedUrl;
                            }
                            return activeDraft.sourceUrl;
                          } else {
                            return (
                              activeDraft.generatedUrl || activeDraft.sourceUrl
                            );
                          }
                        })()
                      )}
                      className="w-full h-full object-contain p-4 blur-sm opacity-50"
                    />
                    {/* 擦除动画效果 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-violet-400/70 to-transparent animate-wipe z-10"></div>
                      </div>
                    </div>
                    {/* 提示文字 */}
                    <div className="absolute bottom-4 left-0 right-0 text-center z-20">
                      <span className="bg-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                        正在移除背景...
                      </span>
                    </div>
                  </div>
                )}
                {/* 多分组时，检查当前选中分组是否正在生成中 */}
                {(() => {
                  const prompts = getTextPrompts(activeDraft);
                  if (prompts.length > 1) {
                    const groupResults = getGroupResults(activeDraft);
                    const groupResult = groupResults[activeGroupIndex];
                    if (groupResult?.status === "generating") {
                      return (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-md">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      );
                    }
                  } else if (activeDraft.status === "generating") {
                    return (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-md">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              {/* 多草稿缩略图（只在有多个草稿时显示） */}
              {memeDrafts.length > 1 && (
                <div className="mt-6 flex gap-2 overflow-x-auto max-w-full p-2 bg-white/50 rounded-xl backdrop-blur-md md:flex-wrap md:justify-center">
                  {memeDrafts.map((draft, idx) => (
                    <div
                      key={draft.id}
                      onClick={() => dispatch(setActiveDraftIndex(idx))}
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 shrink-0 overflow-hidden cursor-pointer relative transition-all hover:scale-105 ${
                        idx === activeDraftIndex
                          ? "border-violet-600 ring-2 ring-violet-200"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={getProxiedImageUrl(
                          draft.generatedUrl || draft.sourceUrl
                        )}
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
              )}
              {/* 多分组缩略图（只要有多个分组就显示，方便查看状态和切换） */}
              {(() => {
                const prompts = getTextPrompts(activeDraft);
                const groupResults = getGroupResults(activeDraft);

                if (prompts.length > 1) {
                  return (
                    <div className="mt-6 flex gap-2 overflow-x-auto max-w-full p-2 bg-white/50 rounded-xl backdrop-blur-md md:flex-wrap md:justify-center">
                      {prompts.map((_, groupIdx) => {
                        const groupResult = groupResults[groupIdx] || {
                          generatedUrl: null,
                          status: "pending" as const,
                        };

                        return (
                          <div
                            key={groupIdx}
                            onClick={() => setActiveGroupIndex(groupIdx)}
                            className={`w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 shrink-0 overflow-hidden cursor-pointer relative transition-all hover:scale-105 ${
                              groupIdx === activeGroupIndex
                                ? "border-violet-600 ring-2 ring-violet-200"
                                : "border-gray-200"
                            }`}
                          >
                            <img
                              src={getProxiedImageUrl(
                                groupResult.generatedUrl ||
                                  activeDraft.sourceUrl
                              )}
                              className="w-full h-full object-cover"
                            />
                            {groupResult.status === "done" && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                            )}
                            {groupResult.status === "generating" && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                              </div>
                            )}
                            {groupResult.status === "error" && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            <AnimationSelector
              activeDraft={activeDraft}
              activeDraftIndex={activeDraftIndex}
              isGeneratingPreview={isGeneratingPreview}
              onAnimationChange={(animation) => {
                const currentDraft = memeDrafts[activeDraftIndex];
                if (!currentDraft) return;

                // 如果正在生成预览，不允许切换
                if (isGeneratingPreview) return;

                dispatch(
                  updateMemeDraft({
                    index: activeDraftIndex,
                    draft: { animation },
                  })
                );

                // 清除预览 GIF，让 useEffect 自动处理预览生成
                if (animation === AnimationType.NONE) {
                  setPreviewGif(null);
                }
                // 其他情况由 useEffect 自动处理，避免重复调用
              }}
            />

            {/* 表情文案和动作指令分组 */}
            <TextPromptGroups
              activeDraft={activeDraft}
              activeDraftIndex={activeDraftIndex}
              activeGroupIndex={activeGroupIndex}
              onGroupSelect={setActiveGroupIndex}
              getGroupResults={getGroupResults}
              hasSelectedMoodPack={hasSelectedMoodPack}
              onApplyMoodPack={applyMoodPackToGroup}
              onRetryGroup={(groupIndex) =>
                handleRetryGroup(activeDraftIndex, groupIndex)
              }
              getTextPrompts={getTextPrompts}
              updateTextPrompts={updateTextPrompts}
            />

            {/* 擦除背景开关 */}
            <BackgroundRemovalControls
              activeDraft={activeDraft}
              activeDraftIndex={activeDraftIndex}
              onToggle={handleBackgroundRemovalToggle}
            />
          </div>
        </div>
      </div>

      <GenerateButton
        pendingCount={pendingCount}
        isGenerating={isGenerating}
        hasError={hasError}
        allFailed={allFailed}
        allCompleted={allCompleted}
        isQuotaReached={isQuotaReached(pendingCount)}
        onGenerate={handleGenerateMemes}
        onUpgrade={() => dispatch(setIsPaymentModalOpen(true))}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => dispatch(setIsPaymentModalOpen(false))}
        onSuccess={() => {
          dispatch(setUserTier(UserTier.PREMIUM));
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
        type="meme"
      />
    </div>
  );
}
