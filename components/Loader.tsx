'use client';

import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "正在生成创意..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-violet-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <Loader2 className="relative text-violet-600 w-12 h-12 animate-spin" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          AI 正在思考
        </h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">{message}</p>
      </div>
    </div>
  );
};

export default Loader;