"use client";

import { Package, Loader2 } from "lucide-react";
import { getProxiedImageUrl } from "@/lib/image-storage";
import { MemeDraft, AnimationType } from "@/types";

interface MemePreviewProps {
  activeDraft: MemeDraft | null;
  previewGif: string | null;
  isGeneratingPreview: boolean;
  processedImageRef: React.MutableRefObject<{ [key: string]: string }>;
  getTextPrompts: (
    draft: MemeDraft
  ) => Array<{ text: string; moodPrompt: string }>;
  getGroupResults: (
    draft: MemeDraft
  ) => Array<{ generatedUrl: string | null; status: string }>;
  activeGroupIndex: number;
  activeDraftIndex: number;
  memeDrafts: MemeDraft[];
}

export default function MemePreview({
  activeDraft,
  previewGif,
  isGeneratingPreview,
  processedImageRef,
  getTextPrompts,
  getGroupResults,
  activeGroupIndex,
  activeDraftIndex,
  memeDrafts,
}: MemePreviewProps) {
  const prompts = activeDraft ? getTextPrompts(activeDraft) : [];
  const hasAnimation =
    activeDraft?.animation !== AnimationType.NONE ||
    memeDrafts[activeDraftIndex]?.animation !== AnimationType.NONE;

  return (
    <div className="bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-100 p-6 md:p-8 flex flex-col items-center justify-center relative md:rounded-2xl md:shadow-sm">
      <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-white rounded-lg shadow-xl border-4 border-white relative flex items-center justify-center">
        <div className="w-full h-full relative overflow-hidden">
          {isGeneratingPreview ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 relative">
              <Loader2 className="animate-spin text-violet-500" size={32} />
              <span className="text-sm text-gray-600">正在生成预览...</span>
            </div>
          ) : activeDraft?.generatedUrl || activeDraft?.sourceUrl ? (
            <>
              {previewGif && hasAnimation ? (
                <img
                  key={`preview-${activeDraft.animation}-${Date.now()}`}
                  src={previewGif}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={() => {
                    console.error("预览 GIF 加载失败");
                  }}
                />
              ) : (
                <>
                  {(() => {
                    let imageUrl: string | null = null;

                    if (prompts.length > 1) {
                      const groupResults = getGroupResults(activeDraft!);
                      const groupResult = groupResults[activeGroupIndex];
                      if (groupResult?.generatedUrl) {
                        imageUrl = groupResult.generatedUrl;
                      } else if (activeDraft?.sourceUrl) {
                        imageUrl = activeDraft.sourceUrl;
                      }
                    } else {
                      if (
                        activeDraft?.status === "done" &&
                        activeDraft.generatedUrl
                      ) {
                        imageUrl = activeDraft.generatedUrl;
                      } else if (
                        activeDraft?.removeBackground &&
                        processedImageRef.current[activeDraft.id]
                      ) {
                        imageUrl = processedImageRef.current[activeDraft.id];
                      } else if (activeDraft?.generatedUrl) {
                        imageUrl = activeDraft.generatedUrl;
                      } else if (activeDraft?.sourceUrl) {
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
                        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                          <span
                            className="text-2xl font-bold text-white stroke-black drop-shadow-md"
                            style={{
                              textShadow:
                                "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                            }}
                          >
                            {prompts.length > 1
                              ? prompts[activeGroupIndex]?.text ||
                                activeDraft?.text ||
                                ""
                              : activeDraft?.text || ""}
                          </span>
                        </div>
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
                <span className="text-sm text-gray-500">请先上传图片</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
