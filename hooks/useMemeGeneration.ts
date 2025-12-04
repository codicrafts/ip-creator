import { useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateMemeDraft,
  updateMemeDraftGroupResult,
  setIsExporting,
} from "@/store/slices/memeSlice";
import {
  updateMemeUsage as updateMemeUsageAPI,
} from "@/services/userService";
import { saveHistory } from "@/services/historyService";
import { generateSticker } from "@/services/geminiService";
import { uploadImageToCloud } from "@/services/imageUploadService";
import { removeBackground, BackgroundRemovalError } from "@/services/backgroundRemovalService";
import { createFinalImageWithText } from "@/utils/image-utils";
import { MemeDraft } from "@/types";
import { getCurrentUserId } from "@/services/authService";

interface UseMemeGenerationProps {
  memeDrafts: MemeDraft[];
  getTextPrompts: (draft: MemeDraft) => Array<{ text: string; moodPrompt: string; textPosition?: "top" | "bottom" }>;
  getGroupResults: (draft: MemeDraft) => Array<{ generatedUrl: string | null; status: string }>;
  processedImageRef: React.MutableRefObject<{ [key: string]: string }>;
  isQuotaReached: (amount?: number) => boolean;
  setIsQuotaModalOpen: (open: boolean) => void;
  setIsProcessingBackground: (processing: boolean) => void;
  textPromptsRef?: React.MutableRefObject<{ [key: string]: Array<{ text: string; moodPrompt: string; textPosition?: "top" | "bottom" }> }>;
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

    // 计算需要生成的任务总数
    let totalGenerations = 0;
    memeDrafts.forEach((draft) => {
      const prompts = getTextPrompts(draft);
      if (prompts.length > 1) {
        // 多分组：计算需要生成的分组数
        const groupResults = draft.groupResults || [];
        prompts.forEach((_, groupIdx) => {
          const groupResult = groupResults[groupIdx];
          if (
            !groupResult ||
            groupResult.status === "pending" ||
            groupResult.status === "error" ||
            groupResult.status === "done"
          ) {
            totalGenerations++;
          }
        });
      } else {
        // 单分组：检查草稿状态
      if (
        draft.status === "pending" ||
        draft.status === "error" ||
        draft.status === "done"
      ) {
          totalGenerations++;
        }
      }
    });

    if (totalGenerations === 0) return;

    // Check quota
    if (isQuotaReached(totalGenerations)) {
      setIsQuotaModalOpen(true);
      return;
    }

    // 并行处理所有草稿（参考场景扩展的逻辑）
    const generationPromises: Promise<void>[] = [];

    memeDrafts.forEach((draft, draftIndex) => {
      // 优先从 textPromptsRef 获取数据，如果 ref 中有数据的话
      let prompts = getTextPrompts(draft);
      
      // 如果 getTextPrompts 返回空数组，尝试直接从 textPromptsRef 获取
      if (prompts.length === 0 && textPromptsRef?.current) {
        const refPrompts = textPromptsRef.current[draft.id];
        if (refPrompts && refPrompts.length > 0) {
          console.log(`[生成任务] 草稿 ${draftIndex}: 从 textPromptsRef 获取到 ${refPrompts.length} 个分组`);
          prompts = refPrompts;
        }
      }
      
      // 如果 draft.prompts 存在且非空，也可以作为备选（持久化数据）
      if (prompts.length <= 1 && draft.prompts && draft.prompts.length > 1) {
         console.log(`[生成任务] 草稿 ${draftIndex}: 从 draft.prompts 获取到 ${draft.prompts.length} 个分组`);
         prompts = draft.prompts;
      }

      // 将 prompts 同步到 Redux 以便持久化（用于导出等）
      if (prompts.length > 1) {
        dispatch(updateMemeDraft({
          index: draftIndex,
          draft: { prompts: prompts }
        }));
      }
      
      console.log(`[生成任务] 草稿 ${draftIndex}: prompts.length = ${prompts.length}`, prompts);
      console.log(`[生成任务] 草稿 ${draftIndex}: draft.id = ${draft.id}`);
      console.log(`[生成任务] 草稿 ${draftIndex}: draft.groupResults =`, draft.groupResults);
      if (textPromptsRef?.current) {
        console.log(`[生成任务] 草稿 ${draftIndex}: textPromptsRef.current[${draft.id}] =`, textPromptsRef.current[draft.id]);
      }

      // 如果 prompts 为空，但 groupResults 存在且长度 > 1，说明应该是多分组
      // 这种情况下，我们需要从 groupResults 推断分组数量，但无法获取 moodPrompt
      // 所以应该跳过这个草稿，或者使用草稿的默认 moodPrompt
      if (prompts.length === 0) {
        console.warn(`[生成任务] 草稿 ${draftIndex}: prompts 为空！`);
        if (draft.groupResults && draft.groupResults.length > 1) {
          console.error(`[生成任务] 草稿 ${draftIndex}: groupResults.length = ${draft.groupResults.length}，但 prompts 为空！无法获取每个分组的 moodPrompt，跳过生成`);
          return;
        }
        // 单分组模式，继续处理（使用草稿的默认值）
        console.log(`[生成任务] 草稿 ${draftIndex}: 单分组模式，使用草稿默认值`);
      }

      if (prompts.length > 1) {
        // 多分组：为每个分组创建独立的生成任务
        // 确保 groupResults 数组长度正确（在创建任务之前）
        const currentDraft = memeDrafts[draftIndex];
        let groupResults = currentDraft?.groupResults || [];
        
        console.log(`[生成任务] 草稿 ${draftIndex}: groupResults.length = ${groupResults.length}`, groupResults);
        
        if (groupResults.length !== prompts.length) {
          console.log(`[生成任务] 草稿 ${draftIndex}: 初始化 groupResults，长度从 ${groupResults.length} 改为 ${prompts.length}`);
          // 同步更新 groupResults，确保后续检查使用最新值
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

        // 为每个分组创建生成任务（类似场景扩展遍历 sceneDrafts）
        prompts.forEach((prompt, groupIndex) => {
          const groupResult = groupResults[groupIndex];
          
          console.log(`[生成任务] 草稿 ${draftIndex} 分组 ${groupIndex}: groupResult =`, groupResult, `moodPrompt="${prompt.moodPrompt || draft.moodPrompt || ""}"`);
          
          // 只处理需要生成的分组（排除正在生成中的）
          if (
            !groupResult ||
            groupResult.status === "pending" ||
            groupResult.status === "error" ||
            groupResult.status === "done"
          ) {
            console.log(`[生成任务] 草稿 ${draftIndex} 分组 ${groupIndex}: 创建生成任务，添加到 promises 数组`);
            // 创建独立的生成任务（类似场景扩展的方式）
            const taskPromise = (async () => {
              try {
                // 设置状态为生成中
                dispatch(
                  updateMemeDraftGroupResult({
                    index: draftIndex,
                    groupIndex: groupIndex,
                    result: { status: "generating" as const },
                  })
                );
                // 同时也需要确保整体状态为 generating（如果还没设置的话）
                // 注意：这里可能会有并发更新，但因为状态是幂等的，所以问题不大
                // 不过为了避免冲突，我们可以只更新分组状态，让 UI 根据分组状态来推断整体状态
                // 或者我们可以单独发一个 action 来更新整体状态
                dispatch(
                  updateMemeDraft({
                    index: draftIndex,
                    draft: { status: "generating" as const },
                  })
                );

                const moodPrompt = prompt.moodPrompt || draft.moodPrompt || "";
                console.log(`[生成任务] 草稿 ${draftIndex} 分组 ${groupIndex}: 开始生成，moodPrompt="${moodPrompt}"`);

                // Generate image
                let generatedImage: string;
                try {
                  console.log(`[生成任务] 草稿 ${draftIndex} 分组 ${groupIndex}: 调用 generateSticker 接口`);
                  generatedImage = await generateSticker(draft.sourceUrl, moodPrompt, {
                    backgroundType: "transparent",
                    removeBackground: draft.removeBackground ?? false,
                  });
                  console.log(`[生成任务] 草稿 ${draftIndex} 分组 ${groupIndex}: generateSticker 接口调用成功`);
                } catch (genError) {
                  console.error(`[生成任务] 草稿 ${draftIndex} 分组 ${groupIndex}: 生成接口调用失败:`, genError);
                  throw genError;
                }

                // Handle background removal if needed
                let finalImage: string;
                if (draft.removeBackground) {
                  try {
                    const processedImage = await removeBackground(
                      generatedImage,
                      draft.refineForeground ?? false
                    );
                    if (!processedImage) {
                      throw new Error("擦除背景接口返回的图片为空");
                    }
                    finalImage = processedImage;
                    // 每个分组使用独立的 key 存储处理后的图片
                    const processedImageKey = `${draft.id}-${groupIndex}`;
                    processedImageRef.current[processedImageKey] = processedImage;
                  } catch (bgError) {
                    console.error("Background removal failed:", bgError);
                    finalImage = generatedImage;
                  }
                } else {
                  finalImage = generatedImage;
                }

                // Create final image with text
                const displayText = prompt.text || draft.text || "";
                const groupTextPosition = prompt.textPosition || draft.textPosition || "bottom";

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
                    const fileName = `meme_${userId}_${Date.now()}_${draftIndex}_${groupIndex}.png`;
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
                    await saveHistory({
                      userId,
                      imageUrl: uploadedUrl,
                      prompt: moodPrompt,
                      type: "meme",
                    });
                  } catch (historyError) {
                    console.error("保存历史失败:", historyError);
                  }
                }

                // Update draft status - use specific action to avoid race conditions
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
                console.error("生成失败:", error);
                const errorKey = `${draftIndex}-${groupIndex}`;
                if (!errorShownRef.current.get(errorKey)) {
                  errorShownRef.current.set(errorKey, true);
                }

                // Update error status - use specific action to avoid race conditions
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
              }
            })();

            generationPromises.push(taskPromise);
          }
        });
      } else {
        // 单分组：处理单个草稿
        if (
          draft.status === "pending" ||
          draft.status === "error" ||
          draft.status === "done"
        ) {
          const taskPromise = (async () => {
            try {
              // 设置状态为生成中
          dispatch(
            updateMemeDraft({
                  index: draftIndex,
              draft: { status: "generating" as const },
            })
          );

              const moodPrompt = draft.moodPrompt || "";

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
                  const processedImage = await removeBackground(
                    generatedImage,
                    draft.refineForeground ?? false
                  );
                  if (!processedImage) {
                    throw new Error("擦除背景接口返回的图片为空");
                  }
                  finalImage = processedImage;
                  const processedImageKey = `${draft.id}-single`;
                  processedImageRef.current[processedImageKey] = processedImage;
                } catch (bgError) {
                  console.error("Background removal failed:", bgError);
                  finalImage = generatedImage;
                }
              } else {
                finalImage = generatedImage;
              }

              // Create final image with text
              const displayText = draft.text || "";
              const textPosition = draft.textPosition || "bottom";

              let finalImageWithTextBase64: string;
              try {
                finalImageWithTextBase64 = await createFinalImageWithText(
                  finalImage,
                  displayText,
                  false,
                  textPosition
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
                  const fileName = `meme_${userId}_${Date.now()}_${draftIndex}_single.png`;
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
                  await saveHistory({
                    userId,
                    imageUrl: uploadedUrl,
                    prompt: moodPrompt,
                    type: "meme",
                  });
                } catch (historyError) {
                  console.error("保存历史失败:", historyError);
                }
              }

              // Update draft status
              dispatch(
                updateMemeDraft({
                  index: draftIndex,
                  draft: {
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
              console.error("生成失败:", error);
              const errorKey = `${draftIndex}-single`;
              if (!errorShownRef.current.get(errorKey)) {
                errorShownRef.current.set(errorKey, true);
              }

              // Update error status
              dispatch(
                updateMemeDraft({
                  index: draftIndex,
                  draft: { status: "error" as const },
                })
              );
            }
          })();

          generationPromises.push(taskPromise);
        }
      }
    });

    // 等待所有生成任务完成（参考场景扩展使用 Promise.allSettled）
    console.log(`[生成任务] 总共创建了 ${generationPromises.length} 个任务，开始并行执行`);
    await Promise.allSettled(generationPromises);
    console.log(`[生成任务] 所有任务执行完成`);
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
              processedImageRef.current[draft.id] = processedImage;
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
        const groupTextPosition = groupPrompt.textPosition || draft.textPosition || "bottom";

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
              await saveHistory({
                userId,
                imageUrl: uploadedUrl,
                prompt: moodPrompt,
                type: "meme",
              });
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


