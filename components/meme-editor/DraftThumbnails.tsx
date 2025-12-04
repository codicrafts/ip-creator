"use client";

import { getProxiedImageUrl } from "@/lib/image-storage";
import { MemeDraft } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { setActiveDraftIndex } from "@/store/slices/memeSlice";

interface DraftThumbnailsProps {
  drafts: MemeDraft[];
  activeIndex: number;
}

export default function DraftThumbnails({
  drafts,
  activeIndex,
}: DraftThumbnailsProps) {
  const dispatch = useAppDispatch();

  if (drafts.length <= 1) return null;

  return (
    <div className="mt-6 flex gap-2 overflow-x-auto max-w-full p-2 bg-white/50 rounded-xl backdrop-blur-md md:flex-wrap md:justify-center">
      {drafts.map((draft, idx) => (
        <div
          key={draft.id}
          onClick={() => dispatch(setActiveDraftIndex(idx))}
          className={`w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 shrink-0 overflow-hidden cursor-pointer relative transition-all hover:scale-105 ${
            idx === activeIndex
              ? "border-violet-600 ring-2 ring-violet-200"
              : "border-gray-200"
          }`}
        >
          <img
            src={getProxiedImageUrl(draft.generatedUrl || draft.sourceUrl)}
            className="w-full h-full object-cover"
            alt={`Draft ${idx + 1}`}
          />
          {draft.status === "done" && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
          )}
          {draft.status === "generating" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
            </div>
          )}
          {draft.status === "error" && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
          )}
        </div>
      ))}
    </div>
  );
}

