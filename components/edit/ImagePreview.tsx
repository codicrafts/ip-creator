"use client";

import { ImageIcon } from "lucide-react";
import { getProxiedImageUrl } from "@/lib/image-storage";
import { LoadingState } from "@/types";

interface ImagePreviewProps {
  imageUrl: string | null;
  loadingState: LoadingState;
  onImageClick?: (url: string) => void;
}

export default function ImagePreview({
  imageUrl,
  loadingState,
  onImageClick,
}: ImagePreviewProps) {
  if (!imageUrl) {
    return (
      <div className="w-full h-48 md:h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <ImageIcon size={48} className="text-gray-300 mb-2" />
        <p className="text-sm text-gray-400">请先上传图片</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 relative">
      <img
        src={getProxiedImageUrl(imageUrl)}
        alt="Preview"
        className="w-full h-48 md:h-64 object-contain bg-gray-100 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => {
          if (loadingState !== LoadingState.GENERATING && onImageClick) {
            onImageClick(getProxiedImageUrl(imageUrl));
          }
        }}
      />
      {loadingState === LoadingState.GENERATING && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="text-white text-sm">生成中...</span>
          </div>
        </div>
      )}
    </div>
  );
}

