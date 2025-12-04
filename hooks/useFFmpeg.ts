import { useRef, useState, useEffect, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export function useFFmpeg() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const initPromiseRef = useRef<Promise<FFmpeg> | null>(null);

  const initFFmpeg = useCallback(async () => {
    if (typeof window === "undefined") {
      throw new Error("FFmpeg can only be used in browser environment");
    }

    // 如果已经初始化完成，直接返回
    if (isReady && ffmpegRef.current) {
      return ffmpegRef.current;
    }

    // 如果正在初始化，等待现有的初始化完成
    if (initPromiseRef.current) {
      return initPromiseRef.current;
    }

    // 开始新的初始化
    setIsLoading(true);
    const initPromise = (async () => {
      try {
        if (!ffmpegRef.current) {
          ffmpegRef.current = new FFmpeg();
        }

        const ffmpeg = ffmpegRef.current;

        // 检查是否已经加载
        if (ffmpeg.loaded) {
          setIsReady(true);
          setIsLoading(false);
          initPromiseRef.current = null;
          return ffmpeg;
        }

        ffmpeg.on("log", ({ message }: { message: string }) => {
          console.log("FFmpeg log:", message);
        });

        const baseURL =
          "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";
        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            "text/javascript"
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm"
          ),
        });

        setIsReady(true);
        console.log("FFmpeg loaded successfully");
        return ffmpeg;
      } catch (error) {
        console.error("Failed to load FFmpeg:", error);
        throw error;
      } finally {
        setIsLoading(false);
        initPromiseRef.current = null;
      }
    })();

    initPromiseRef.current = initPromise;
    return initPromise;
  }, [isReady]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (ffmpegRef.current) {
        try {
          ffmpegRef.current.terminate();
        } catch (error) {
          console.error("Error terminating FFmpeg:", error);
        }
      }
    };
  }, []);

  return {
    ffmpeg: ffmpegRef.current,
    isReady,
    isLoading,
    initFFmpeg,
  };
}

