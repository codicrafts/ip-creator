"use client";

import { Wand2, Loader2, RefreshCcw } from "lucide-react";

interface GenerateButtonProps {
  pendingCount: number;
  isGenerating: boolean;
  hasError: boolean;
  allFailed: boolean;
  allCompleted: boolean;
  isQuotaReached: boolean;
  onGenerate: () => void;
  onUpgrade?: () => void;
}

export default function GenerateButton({
  pendingCount,
  isGenerating,
  hasError,
  allFailed,
  allCompleted,
  isQuotaReached,
  onGenerate,
  onUpgrade,
}: GenerateButtonProps) {
  const getButtonText = () => {
    if (isGenerating) return "生成中...";
    if (isQuotaReached) return "表情包制作额度已用完";
    if (hasError && allFailed) return "生成失败，重新生成";
    if (hasError) return "部分失败，重新生成";
    if (allCompleted) return "重新生成";
    if (pendingCount > 0) return "立即生成";
    return "立即生成";
  };

  const getButtonIcon = () => {
    if (isGenerating) return <Loader2 className="animate-spin" size={18} />;
    if (hasError) return <RefreshCcw size={18} />;
    return <Wand2 size={18} />;
  };

  const getButtonStyle = () => {
    if (isGenerating || isQuotaReached) {
      return "bg-gray-200 text-gray-400 cursor-not-allowed";
    }
    if (hasError && !isGenerating) {
      return "bg-red-500 text-white shadow-red-200 hover:bg-red-600";
    }
    return "bg-violet-600 text-white shadow-violet-200 hover:bg-violet-700";
  };

  return (
    <div className="px-6 md:px-12 pb-4 pt-2 bg-gradient-to-t from-gray-50 to-transparent max-w-6xl mx-auto w-full">
      {pendingCount > 0 ? (
        <>
          <button
            onClick={onGenerate}
            disabled={isGenerating || isQuotaReached}
            className={`w-full py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${getButtonStyle()}`}
          >
            {getButtonIcon()}
            {getButtonText()}
          </button>
          {isQuotaReached && onUpgrade && (
            <p
              onClick={onUpgrade}
              className="text-center text-xs text-violet-600 mt-2 cursor-pointer hover:underline"
            >
              升级会员获取更多表情包制作额度 &rarr;
            </p>
          )}
        </>
      ) : (
        <button
          onClick={onGenerate}
          disabled={isGenerating || isQuotaReached}
          className={`w-full py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${getButtonStyle()}`}
        >
          {getButtonIcon()}
          {getButtonText()}
        </button>
      )}
    </div>
  );
}

