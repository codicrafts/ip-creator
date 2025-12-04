import { useCallback, useState, useRef, useEffect } from "react";
import { MemeDraft, AnimationType } from "@/types";
import { createGifWithFFmpeg, getAnimationConfig } from "@/utils/gif-utils";
import { useFFmpeg } from "./useFFmpeg";

export function useMemePreview(
  processedImageRef: React.MutableRefObject<{ [key: string]: string }>
) {
  const [previewGif, setPreviewGif] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const { ffmpeg, isReady, isLoading, initFFmpeg } = useFFmpeg();
  const isGeneratingRef = useRef(false);

  // 同步 ref 和 state
  useEffect(() => {
    isGeneratingRef.current = isGeneratingPreview;
  }, [isGeneratingPreview]);

  const generatePreview = useCallback(
    async (draft: MemeDraft) => {
      if (draft.animation === AnimationType.NONE) {
        setPreviewGif(null);
        return;
      }

      if (!draft.generatedUrl && !draft.sourceUrl) {
        setPreviewGif(null);
        return;
      }

      // 如果正在生成预览，跳过（使用 ref 避免依赖变化）
      if (isGeneratingRef.current) {
        return;
      }

      setIsGeneratingPreview(true);
      try {
        // 确保 FFmpeg 已初始化
        const currentFFmpeg = await initFFmpeg();
        if (!currentFFmpeg) {
          throw new Error("FFmpeg 初始化失败");
        }

        const gifDataUrl = await createGifWithFFmpeg(
          draft,
          currentFFmpeg,
          processedImageRef,
          {
            width: 240,
            height: 240,
            withBackground: !draft.removeBackground,
            skipText: true, // generatedUrl 已经包含文字，跳过添加文字
          }
        );

        setPreviewGif(gifDataUrl);
      } catch (error) {
        console.error("生成预览失败:", error);
        setPreviewGif(null);
      } finally {
        setIsGeneratingPreview(false);
      }
    },
    [initFFmpeg, processedImageRef]
  );

  return {
    previewGif,
    isGeneratingPreview,
    generatePreview,
    setPreviewGif,
  };
}


