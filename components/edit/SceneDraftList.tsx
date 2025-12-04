"use client";

import { X } from "lucide-react";
import { SceneDraft } from "@/types";

interface SceneDraftListProps {
  drafts: SceneDraft[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onUpdate: (index: number, draft: Partial<SceneDraft>) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export default function SceneDraftList({
  drafts,
  activeIndex,
  onSelect,
  onUpdate,
  onRemove,
  disabled = false,
}: SceneDraftListProps) {
  if (drafts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {drafts.map((draft, index) => (
        <div
          key={draft.id}
          className={`p-4 rounded-xl border-2 transition-all ${
            index === activeIndex
              ? "border-violet-500 bg-violet-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600">
                场景 {index + 1}
              </span>
              {draft.status === "done" && (
                <span className="text-xs text-green-600">✓ 已完成</span>
              )}
              {draft.status === "generating" && (
                <span className="text-xs text-blue-600">生成中...</span>
              )}
              {draft.status === "error" && (
                <span className="text-xs text-red-600">✗ 失败</span>
              )}
            </div>
            {drafts.length > 1 && (
              <button
                onClick={() => onRemove(index)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                disabled={disabled}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <textarea
            value={draft.prompt || ""}
            onChange={(e) => onUpdate(index, { prompt: e.target.value })}
            onClick={() => onSelect(index)}
            placeholder={`场景 ${index + 1} 的提示词...`}
            className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none text-gray-700 shadow-sm h-24 text-sm"
            disabled={disabled}
          />
        </div>
      ))}
      <p className="text-xs text-gray-500">
        提示：每个场景可以设置不同的提示词，保持角色的一致性。
      </p>
    </div>
  );
}

