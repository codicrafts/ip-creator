"use client";

import { Zap } from "lucide-react";

interface QuotaDisplayProps {
  remaining: number;
  limit: number;
  isReached: boolean;
}

export default function QuotaDisplay({
  remaining,
  limit,
  isReached,
}: QuotaDisplayProps) {
  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border ${
        isReached
          ? "bg-red-50 text-red-600 border-red-200"
          : "bg-violet-50 text-violet-700 border-violet-200"
      }`}
    >
      <Zap size={16} fill="currentColor" />
      <span className="font-semibold">
        {remaining} / {limit}
      </span>
    </div>
  );
}

