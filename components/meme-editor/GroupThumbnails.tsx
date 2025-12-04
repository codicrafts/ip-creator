"use client";

import { useState } from "react";
import { getProxiedImageUrl } from "@/lib/image-storage";
import { MemeDraft } from "@/types";

interface GroupThumbnailsProps {
  activeDraft: MemeDraft | null;
  prompts: Array<{ text: string; moodPrompt: string }>;
  groupResults: Array<{ generatedUrl: string | null; status: string }>;
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function GroupThumbnails({
  activeDraft,
  prompts,
  groupResults,
  activeIndex,
  onSelect,
}: GroupThumbnailsProps) {
  if (prompts.length <= 1 || !groupResults.some((r) => r.generatedUrl)) {
    return null;
  }

  return (
    <div className="mt-6 flex gap-2 overflow-x-auto max-w-full p-2 bg-white/50 rounded-xl backdrop-blur-md md:flex-wrap md:justify-center">
      {prompts.map((_, groupIdx) => {
        const groupResult = groupResults[groupIdx] || {
          generatedUrl: null,
          status: "pending" as const,
        };

        return (
          <div
            key={groupIdx}
            onClick={() => onSelect(groupIdx)}
            className={`w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 shrink-0 overflow-hidden cursor-pointer relative transition-all hover:scale-105 ${
              groupIdx === activeIndex
                ? "border-violet-600 ring-2 ring-violet-200"
                : "border-gray-200"
            }`}
          >
            <img
              src={getProxiedImageUrl(
                groupResult.generatedUrl || activeDraft?.sourceUrl || ""
              )}
              className="w-full h-full object-cover"
              alt={`Group ${groupIdx + 1}`}
            />
            {groupResult.status === "done" && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
            )}
            {groupResult.status === "generating" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
              </div>
            )}
            {groupResult.status === "error" && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

