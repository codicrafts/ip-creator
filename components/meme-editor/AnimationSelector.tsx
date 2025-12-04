"use client";

import { Play } from "lucide-react";
import { ANIMATION_OPTIONS } from "@/lib/constants";
import { AnimationType, MemeDraft } from "@/types";

interface AnimationSelectorProps {
  activeDraft: MemeDraft | null;
  activeDraftIndex: number;
  isGeneratingPreview: boolean;
  onAnimationChange: (animation: AnimationType) => void;
}

export default function AnimationSelector({
  activeDraft,
  activeDraftIndex,
  isGeneratingPreview,
  onAnimationChange,
}: AnimationSelectorProps) {
  if (!activeDraft) return null;

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
        <Play size={16} className="text-violet-500" /> 动态特效
      </label>
      <div className="flex gap-2 flex-wrap">
        {ANIMATION_OPTIONS.map((anim) => (
          <button
            key={anim.id}
            onClick={() => onAnimationChange(anim.id)}
            disabled={isGeneratingPreview}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 border transition-colors whitespace-nowrap ${
              isGeneratingPreview
                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                : activeDraft.animation === anim.id
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
  );
}

