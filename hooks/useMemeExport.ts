import { useCallback } from "react";
import JSZip from "jszip";
import { MemeDraft, AnimationType } from "@/types";
import { createFinalImageWithText } from "@/utils/image-utils";
import { createGifWithFFmpeg } from "@/utils/gif-utils";
import { useFFmpeg } from "./useFFmpeg";

interface UseMemeExportProps {
  memeDrafts: MemeDraft[];
  getTextPrompts: (draft: MemeDraft) => Array<{ text: string; moodPrompt: string }>;
  processedImageRef: React.MutableRefObject<{ [key: string]: string }>;
}

export function useMemeExport({ memeDrafts, getTextPrompts, processedImageRef }: UseMemeExportProps) {
  const { initFFmpeg } = useFFmpeg();

  const exportWeChatPackage = useCallback(async () => {
    const zip = new JSZip();
    let fileCount = 0;

    // 初始化 FFmpeg（所有表情包都需要生成 GIF）
    let ffmpeg: any = null;
    try {
      console.log("开始初始化 FFmpeg...");
      ffmpeg = await initFFmpeg();
      console.log("FFmpeg 初始化成功:", !!ffmpeg);
    } catch (error) {
      console.error("FFmpeg 初始化失败:", error);
      // 如果 FFmpeg 初始化失败，继续使用静态图片导出
      alert("FFmpeg 初始化失败，将只导出 PNG 格式");
    }

    for (const draft of memeDrafts) {
      // 1. 优先从 draft.prompts 获取（最准确的数据源）
      let prompts = draft.prompts;
      
      // 2. 如果没有，尝试通过 getTextPrompts 获取（兼容旧逻辑）
      if (!prompts || prompts.length === 0) {
        prompts = getTextPrompts(draft);
      }

      // 3. 如果还是没有（或者 getTextPrompts 回退到了默认单分组），但 groupResults 长度大于1，
      // 说明是多分组但数据丢失，尝试恢复（虽然没有 prompt 文本，但至少可以导出图片）
      if ((!prompts || prompts.length <= 1) && draft.groupResults && draft.groupResults.length > 1) {
         console.warn(`草稿 ${draft.id} 似乎丢失了 prompts 数据，但有 ${draft.groupResults.length} 个生成结果。尝试恢复...`);
         prompts = draft.groupResults.map((_, idx) => ({
             text: draft.text || "", // 只能使用主文本
             moodPrompt: draft.moodPrompt || "",
             textPosition: draft.textPosition
         }));
      }
      
      // 确保 prompts 不为空
      if (!prompts) prompts = [];

      // 检查是否有动画：使用字符串比较，因为枚举值就是字符串
      const hasAnimation = draft.animation && draft.animation !== AnimationType.NONE && draft.animation !== "none";
      
      if (prompts.length > 1 && draft.groupResults) {
        // 多分组：导出每个分组的图片
        for (let i = 0; i < prompts.length; i++) {
          const groupResult = draft.groupResults[i];
          
          if (groupResult?.generatedUrl && groupResult.status === "done") {
            try {
              // 总是生成 PNG 和 GIF 两个格式
              // 使用更清晰的文件名命名规则: meme_{draftIndex}_{groupIndex}.ext
              const baseFileName = `meme_${memeDrafts.indexOf(draft) + 1}_${i + 1}`;
              
              // 生成 PNG 格式（静态版本）
              // 使用该分组的文字位置
              const groupTextPosition = prompts[i]?.textPosition || draft.textPosition || "bottom";
              const pngImage = await createFinalImageWithText(
                groupResult.generatedUrl,
                prompts[i].text,
                false,
                groupTextPosition
              );
              const pngBlob = await fetch(pngImage).then((r) => r.blob());
              zip.file(`${baseFileName}.png`, pngBlob);
              fileCount++;
              
              // 生成 GIF 格式（如果有动画则动态，否则静态）
              if (ffmpeg) {
                try {
                  // 创建临时 draft 用于生成 GIF
                  const tempDraft: MemeDraft = {
                    ...draft,
                    generatedUrl: groupResult.generatedUrl,
                    text: prompts[i].text,
                    textPosition: prompts[i]?.textPosition || draft.textPosition || "bottom",
                  };
                  
                  // 获取该分组的去背图片（如果存在）
                  const processedKey = `${draft.id}-${i}`;
                  const processedUrl = processedImageRef.current[processedKey];

                  const gifImage = await createGifWithFFmpeg(
                    tempDraft,
                    ffmpeg,
                    processedImageRef,
                    {
                      width: 240, // 统一尺寸为 240×240
                      height: 240,
                      withBackground: !draft.removeBackground,
                      skipText: false, // 添加文字，与预览保持一致
                      sourceImageUrl: processedUrl, // 显式传递去背图片
                    }
                  );
                  const gifBlob = await fetch(gifImage).then((r) => r.blob());
                  zip.file(`${baseFileName}.gif`, gifBlob);
                  fileCount++;
                } catch (gifError) {
                  console.error(`生成 GIF 失败:`, gifError);
                  // GIF 生成失败不影响 PNG 的导出
                }
              }
            } catch (error) {
              console.error(`导出分组 ${i + 1} 失败:`, error);
            }
          }
        }
      } else {
        // 单分组：导出主草稿
        if (draft.generatedUrl && draft.status === "done") {
          try {
            // 总是生成 PNG 和 GIF 两个格式
            const baseFileName = `meme_${memeDrafts.indexOf(draft) + 1}`;
            
            // 生成 PNG 格式（静态版本）
            const pngImage = await createFinalImageWithText(
              draft.generatedUrl,
              draft.text || "",
              false,
              draft.textPosition || "bottom" // 修复：传递 textPosition
            );
            const pngBlob = await fetch(pngImage).then((r) => r.blob());
            zip.file(`${baseFileName}.png`, pngBlob);
            fileCount++;
            
            // 生成 GIF 格式（如果有动画则动态，否则静态）
            if (ffmpeg) {
              try {
                // 尝试获取去背图片（兼容新旧 key）
                const processedKey = `${draft.id}-single`;
                const processedUrl = processedImageRef.current[processedKey] || processedImageRef.current[draft.id];

                const gifImage = await createGifWithFFmpeg(
                  draft,
                  ffmpeg,
                  processedImageRef,
                  {
                    width: 240, // 统一尺寸为 240×240
                    height: 240,
                    withBackground: !draft.removeBackground,
                    skipText: false, // 添加文字，与预览保持一致
                    sourceImageUrl: processedUrl, // 显式传递去背图片
                  }
                );
                const gifBlob = await fetch(gifImage).then((r) => r.blob());
                zip.file(`${baseFileName}.gif`, gifBlob);
                fileCount++;
              } catch (gifError) {
                console.error("生成 GIF 失败:", gifError);
                // GIF 生成失败不影响 PNG 的导出
              }
            }
          } catch (error) {
            console.error(`导出草稿失败:`, error);
          }
        }
      }
    }

    if (fileCount === 0) {
      throw new Error("没有可导出的表情包");
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `memes_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [memeDrafts, getTextPrompts, processedImageRef, initFFmpeg]);

  return {
    exportWeChatPackage,
  };
}


