import { useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateMemeDraft,
  updateMemeDraftGroupResult,
  setIsExporting,
} from "@/store/slices/memeSlice";
import { updateMemeUsage as updateMemeUsageAPI } from "@/services/userService";
import { batchSaveHistory, saveHistory } from "@/services/historyService";
import {
  generateBatchStickers,
  generateSticker,
} from "@/services/geminiService";
import {
  batchUploadImagesToCloud,
  uploadImageToCloud,
} from "@/services/imageUploadService";
import {
  removeBackground,
  BackgroundRemovalError,
} from "@/services/backgroundRemovalService";
import { createFinalImageWithText } from "@/utils/image-utils";
import { MemeDraft } from "@/types";
import { getCurrentUserId } from "@/services/authService";

interface UseMemeGenerationProps {
  memeDrafts: MemeDraft[];
  getTextPrompts: (
    draft: MemeDraft
  ) => Array<{
    text: string;
    moodPrompt: string;
    textPosition?: "top" | "bottom";
  }>;
  getGroupResults: (
    draft: MemeDraft
  ) => Array<{ generatedUrl: string | null; status: string }>;
  processedImageRef: React.MutableRefObject<{ [key: string]: string }>;
  isQuotaReached: (amount?: number) => boolean;
  setIsQuotaModalOpen: (open: boolean) => void;
  setIsProcessingBackground: (processing: boolean) => void;
  textPromptsRef?: React.MutableRefObject<{
    [key: string]: Array<{
      text: string;
      moodPrompt: string;
      textPosition?: "top" | "bottom";
    }>;
  }>;
}

export function useMemeGeneration({
  memeDrafts,
  getTextPrompts,
  getGroupResults,
  processedImageRef,
  isQuotaReached,
  setIsQuotaModalOpen,
  setIsProcessingBackground,
  textPromptsRef,
}: UseMemeGenerationProps) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.userId);
  const errorShownRef = useRef<Map<string, boolean>>(new Map());

  const generateMemes = useCallback(async () => {
    errorShownRef.current.clear();

    // 收集所有需要生成的任务
    const allTasks: Array<{
      draftIndex: number;
      groupIndex: number; // 单分组模式下为 -1
      sourceUrl: string;
      moodPrompt: string;
      text: string;
      textPosition: "top" | "bottom";
      removeBackground: boolean;
      refineForeground: boolean;
    }> = [];

    memeDrafts.forEach((draft, draftIndex) => {
      // 优先从 textPromptsRef 获取数据
      let prompts = getTextPrompts(draft);

      // 如果 getTextPrompts 返回空数组，尝试直接从 textPromptsRef 获取
      if (prompts.length === 0 && textPromptsRef?.current) {
        const refPrompts = textPromptsRef.current[draft.id];
        if (refPrompts && refPrompts.length > 0) {
          prompts = refPrompts;
        }
      }

      // 如果 draft.prompts 存在且非空，也可以作为备选
      if (prompts.length <= 1 && draft.prompts && draft.prompts.length > 1) {
        prompts = draft.prompts;
      }

      // 将 prompts 同步到 Redux 以便持久化
      if (prompts.length > 1) {
        dispatch(
          updateMemeDraft({
            index: draftIndex,
            draft: { prompts: prompts },
          })
        );
      }

      if (prompts.length > 1) {
        // 多分组
        const currentDraft = memeDrafts[draftIndex];
        let groupResults = currentDraft?.groupResults || [];

        if (groupResults.length !== prompts.length) {
          groupResults = prompts.map(() => ({
            generatedUrl: null,
            status: "pending" as const,
          }));
          dispatch(
            updateMemeDraft({
              index: draftIndex,
              draft: {
                groupResults: groupResults,
              },
            })
          );
        }

        prompts.forEach((prompt, groupIndex) => {
          const groupResult = groupResults[groupIndex];

          if (
            !groupResult ||
            groupResult.status === "pending" ||
            groupResult.status === "error" ||
            groupResult.status === "done"
          ) {
            // 更新状态为 generating
            dispatch(
              updateMemeDraftGroupResult({
                index: draftIndex,
                groupIndex: groupIndex,
                result: { status: "generating" as const },
              })
            );

            allTasks.push({
              draftIndex,
              groupIndex,
              sourceUrl: draft.sourceUrl,
              moodPrompt: prompt.moodPrompt || draft.moodPrompt || "",
              text: prompt.text || draft.text || "",
              textPosition:
                prompt.textPosition || draft.textPosition || "bottom",
              removeBackground: draft.removeBackground ?? false,
              refineForeground: draft.refineForeground ?? false,
            });
          }
        });
      } else {
        // 单分组
        if (
          draft.status === "pending" ||
          draft.status === "error" ||
          draft.status === "done"
        ) {
          dispatch(
            updateMemeDraft({
              index: draftIndex,
              draft: { status: "generating" as const },
            })
          );

          allTasks.push({
            draftIndex,
            groupIndex: -1,
            sourceUrl: draft.sourceUrl,
            moodPrompt: draft.moodPrompt || "",
            text: draft.text || "",
            textPosition: draft.textPosition || "bottom",
            removeBackground: draft.removeBackground ?? false,
            refineForeground: draft.refineForeground ?? false,
          });
        }
      }
    });

    if (allTasks.length === 0) return;

    // Check quota
    if (isQuotaReached(allTasks.length)) {
      setIsQuotaModalOpen(true);
      return;
    }

    // 1. 批量生成 (调用 Gemini 批量接口)
    const batchRequests = allTasks.map((task, index) => ({
      base64Image: task.sourceUrl,
      moodPrompt: task.moodPrompt,
      index, // 使用 allTasks 的索引
      options: {
        removeBackground: task.removeBackground,
        keepOriginal: false, // 表情包生成不保留原图
      },
    }));

    try {
      console.log(`[生成任务] 开始批量生成 ${batchRequests.length} 个表情包`);
      const batchResults = await generateBatchStickers(batchRequests);

      // 2. 处理生成结果（擦除背景、添加文字、上传、保存历史）
      // 这里仍然需要并行处理后续步骤，因为每个任务的后续处理是独立的
      // 但我们可以批量上传和批量保存历史

      const processedTasks = await Promise.all(
        batchResults.map(async (res) => {
          const task = allTasks[res.index];
          const draftIndex = task.draftIndex;
          const groupIndex = task.groupIndex;

          if (res.error || !res.result) {
            console.error(`Task ${res.index} generation failed:`, res.error);
            // 更新失败状态
            if (groupIndex === -1) {
              dispatch(
                updateMemeDraft({
                  index: draftIndex,
                  draft: { status: "error" as const },
                })
              );
            } else {
              dispatch(
                updateMemeDraftGroupResult({
                  index: draftIndex,
                  groupIndex: groupIndex,
                  result: { generatedUrl: null, status: "error" as const },
                })
              );
            }
            return null;
          }

          let generatedImage = res.result;

          // Handle background removal
          let finalImage: string;
          if (task.removeBackground) {
            try {
              const processedImage = await removeBackground(
                generatedImage,
                task.refineForeground
              );
              if (!processedImage) {
                throw new Error("擦除背景接口返回的图片为空");
              }
              finalImage = processedImage;
              const processedImageKey =
                groupIndex === -1
                  ? `${memeDrafts[draftIndex].id}-single`
                  : `${memeDrafts[draftIndex].id}-${groupIndex}`;
              processedImageRef.current[processedImageKey] = processedImage;
            } catch (bgError) {
              console.error("Background removal failed:", bgError);
              finalImage = generatedImage;
            }
          } else {
            finalImage = generatedImage;
          }

          // Add text
          let finalImageWithTextBase64: string;
          try {
            finalImageWithTextBase64 = await createFinalImageWithText(
              finalImage,
              task.text,
              false,
              task.textPosition
            );
          } catch (textError) {
            console.error("添加文字失败:", textError);
            finalImageWithTextBase64 = finalImage;
          }

          return {
            ...task,
            finalImage: finalImageWithTextBase64,
            originalPrompt: task.moodPrompt,
          };
        })
      );

      // 过滤掉失败的任务
      const successfulTasks = processedTasks.filter(
        (t): t is NonNullable<typeof t> => t !== null
      );

      if (successfulTasks.length === 0) return;

      // 3. 批量上传
      const uploadTasks = successfulTasks.map((task, i) => {
        const userIdStr = userId || "guest";
        const groupSuffix = task.groupIndex === -1 ? "single" : task.groupIndex;
        const fileName = `meme_${userIdStr}_${Date.now()}_${
          task.draftIndex
        }_${groupSuffix}.png`;
        return {
          base64Data: task.finalImage,
          fileName,
          index: i, // 使用 successfulTasks 的索引
        };
      });

      const uploadResults = await batchUploadImagesToCloud(uploadTasks);
      const uploadedUrls: Record<number, string> = {}; // index -> url

      uploadResults.forEach((res) => {
        if (res.url) {
          uploadedUrls[res.index] = res.url;
        } else {
          console.error(`Task upload failed:`, res.error);
          // 上传失败使用 base64 作为后备
        }
      });

      // 4. 更新状态和批量保存历史
      const historyItems: Array<{
        userId: string;
        url: string;
        prompt: string;
        type: "meme";
        index: number;
      }> = [];

      successfulTasks.forEach((task, i) => {
        const url = uploadedUrls[i] || task.finalImage;
        const draftIndex = task.draftIndex;
        const groupIndex = task.groupIndex;

        // 更新状态
        if (groupIndex === -1) {
          dispatch(
            updateMemeDraft({
              index: draftIndex,
              draft: {
                generatedUrl: url,
                status: "done" as const,
              },
            })
          );
        } else {
          dispatch(
            updateMemeDraftGroupResult({
              index: draftIndex,
              groupIndex: groupIndex,
              result: {
                generatedUrl: url,
                status: "done" as const,
              },
            })
          );
        }

        if (userId) {
          historyItems.push({
            userId,
            url,
            prompt: task.originalPrompt,
            type: "meme",
            index: i,
          });
        }
      });

      // 5. 批量保存历史和更新使用次数
      if (historyItems.length > 0) {
        // 批量保存历史需要后端支持，目前我们使用 Promise.all 并行调用
        // 或者如果 historyService 支持 batchSaveHistory 更好
        // 假设已经支持 batchSaveHistory（参考场景扩展）
        try {
          // 转换格式以匹配 batchSaveHistory
          const batchHistoryItems = historyItems.map((item) => ({
            type: "meme" as const,
            url: item.url,
            prompt: item.prompt,
            index: item.index,
          }));
          await batchSaveHistory(batchHistoryItems);
        } catch (historyError) {
          console.error("Batch save history failed:", historyError);
        }

        // 更新使用次数 (一次性更新)
        if (userId) {
          try {
            await updateMemeUsageAPI(userId, historyItems.length);
          } catch (usageError) {
            console.error("更新使用次数失败:", usageError);
          }
        }
      }
    } catch (error) {
      console.error("Batch process failed:", error);
      // 将所有涉及的任务设为失败
      allTasks.forEach((task) => {
        if (task.groupIndex === -1) {
          dispatch(
            updateMemeDraft({
              index: task.draftIndex,
              draft: { status: "error" as const },
            })
          );
        } else {
          dispatch(
            updateMemeDraftGroupResult({
              index: task.draftIndex,
              groupIndex: task.groupIndex,
              result: { generatedUrl: null, status: "error" as const },
            })
          );
        }
      });
    }
  }, [
    memeDrafts,
    getTextPrompts,
    getGroupResults,
    processedImageRef,
    isQuotaReached,
    setIsQuotaModalOpen,
    setIsProcessingBackground,
    dispatch,
    textPromptsRef,
    userId,
  ]);

  const retryGroup = useCallback(
    async (draftIndex: number, groupIndex: number) => {
      const draft = memeDrafts[draftIndex];
      if (!draft) return;

      const prompts = getTextPrompts(draft);
      if (prompts.length <= 1 || groupIndex >= prompts.length) {
        // 单分组模式，使用 generateMemes
        await generateMemes();
        return;
      }

      // 检查配额
      if (isQuotaReached(1)) {
        setIsQuotaModalOpen(true);
        return;
      }

      // 设置该分组状态为 generating
      dispatch(
        updateMemeDraftGroupResult({
          index: draftIndex,
          groupIndex: groupIndex,
          result: {
            generatedUrl: null,
            status: "generating" as const,
          },
        })
      );

      try {
        const groupPrompt = prompts[groupIndex];
        const moodPrompt = groupPrompt.moodPrompt || "";

        // Generate image
        let generatedImage: string;
        try {
          generatedImage = await generateSticker(draft.sourceUrl, moodPrompt, {
            backgroundType: "transparent",
            removeBackground: draft.removeBackground ?? false,
          });
        } catch (genError) {
          console.error("生成接口调用失败:", genError);
          throw genError;
        }

        // Handle background removal if needed
        let finalImage: string;
        if (draft.removeBackground) {
          try {
            setIsProcessingBackground(true);
            const processedImage = await removeBackground(
              generatedImage,
              draft.refineForeground ?? false
            );
            if (!processedImage) {
              throw new Error("擦除背景接口返回的图片为空");
            }
            finalImage = processedImage;
            processedImageRef.current[`${draft.id}-${groupIndex}`] =
              processedImage;
          } catch (bgError) {
            console.error("Background removal failed:", bgError);
            finalImage = generatedImage;
          } finally {
            setIsProcessingBackground(false);
          }
        } else {
          finalImage = generatedImage;
        }

        // Create final image with text
        const displayText = groupPrompt.text || "";
        const groupTextPosition =
          groupPrompt.textPosition || draft.textPosition || "bottom";

        let finalImageWithTextBase64: string;
        try {
          finalImageWithTextBase64 = await createFinalImageWithText(
            finalImage,
            displayText,
            false,
            groupTextPosition
          );
        } catch (textError) {
          console.error("添加文字失败:", textError);
          finalImageWithTextBase64 = finalImage;
        }

        // Upload to cloud storage
        const userId = getCurrentUserId();
        let uploadedUrl: string;
        try {
          if (userId) {
            const fileName = `meme_${userId}_${Date.now()}_${draftIndex}_${groupIndex}_retry.png`;
            const uploadResult = await uploadImageToCloud(
              finalImageWithTextBase64,
              fileName
            );
            uploadedUrl = uploadResult?.url || finalImageWithTextBase64;
          } else {
            uploadedUrl = finalImageWithTextBase64;
          }
        } catch (uploadError) {
          console.error("上传失败:", uploadError);
          uploadedUrl = finalImageWithTextBase64;
        }

        // Save to history
        if (userId) {
          try {
            await saveHistory(
              "meme",
              uploadedUrl,
              moodPrompt
            );
          } catch (historyError) {
            console.error("保存历史失败:", historyError);
          }
        }

        // Update group result
        dispatch(
          updateMemeDraftGroupResult({
            index: draftIndex,
            groupIndex: groupIndex,
            result: {
              generatedUrl: uploadedUrl,
              status: "done" as const,
            },
          })
        );

        // Update usage
        if (userId) {
          try {
            await updateMemeUsageAPI(userId, 1);
          } catch (usageError) {
            console.error("更新使用次数失败:", usageError);
          }
        }
      } catch (error) {
        console.error(`重试分组 ${groupIndex + 1} 失败:`, error);

        // Update group result to error
        dispatch(
          updateMemeDraftGroupResult({
            index: draftIndex,
            groupIndex: groupIndex,
            result: {
              generatedUrl: null,
              status: "error" as const,
            },
          })
        );

        // Error status is already shown in UI, no need for alert
      }
    },
    [
      memeDrafts,
      getTextPrompts,
      getGroupResults,
      processedImageRef,
      isQuotaReached,
      setIsQuotaModalOpen,
      setIsProcessingBackground,
      dispatch,
    ]
  );

  return {
    generateMemes,
    retryGroup,
  };
}
