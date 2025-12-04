"use client";

import { Layers, Sparkles } from "lucide-react";
import { MemeDraft } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { updateMemeDraft } from "@/store/slices/memeSlice";

interface BackgroundRemovalControlsProps {
  activeDraft: MemeDraft | null;
  activeDraftIndex: number;
  onToggle: (checked: boolean) => void;
}

export default function BackgroundRemovalControls({
  activeDraft,
  activeDraftIndex,
  onToggle,
}: BackgroundRemovalControlsProps) {
  const dispatch = useAppDispatch();

  if (!activeDraft) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Layers size={16} className="text-violet-500" /> 擦除背景
          </label>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={activeDraft.removeBackground ?? false}
            onChange={(e) => onToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
        </label>
      </div>

      {activeDraft.removeBackground && (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Sparkles size={16} className="text-violet-500" /> 精炼边缘
            </label>
            <span className="text-xs text-gray-400">更高质量，但更慢</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={activeDraft.refineForeground ?? false}
              onChange={(e) => {
                dispatch(
                  updateMemeDraft({
                    index: activeDraftIndex,
                    draft: { refineForeground: e.target.checked },
                  })
                );
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
          </label>
        </div>
      )}
    </div>
  );
}

