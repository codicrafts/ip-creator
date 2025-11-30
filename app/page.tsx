"use client";

import { useRouter } from "next/navigation";
import { Wand2, Sparkles, Smile, ChevronRight, Lock } from "lucide-react";
import { useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setMemeDrafts, setActiveDraftIndex } from "@/store/slices/memeSlice";
import { AnimationType } from "@/types";
import { isFeatureDisabled } from "@/lib/feature-flags";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const featureDisabled = isFeatureDisabled();

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 从首页直接选择文件，初始化表情包草稿并跳转到表情包编辑器
        dispatch(
          setMemeDrafts([
            {
              id: Date.now().toString(),
              sourceUrl: reader.result as string,
              generatedUrl: null,
              text: "你好",
              moodPrompt: "开心挥手",
              status: "pending",
              animation: AnimationType.NONE,
            },
          ])
        );
        dispatch(setActiveDraftIndex(0));
        router.push("/meme-editor");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-white to-violet-50 overflow-y-auto no-scrollbar md:pt-16">
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-8">
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          <div className="absolute inset-0 bg-violet-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
          <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-violet-100 ring-1 ring-gray-100 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Wand2 className="w-16 h-16 md:w-20 md:h-20 text-violet-600" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative inline-block">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              IP 创想坊
            </h1>
            <span className="absolute -top-2 -right-8 md:-right-12 bg-gradient-to-r from-violet-500 to-violet-600 text-white text-[10px] md:text-xs font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full shadow-lg shadow-violet-200">
              Beta
            </span>
          </div>
          <p className="text-gray-500 max-w-xs md:max-w-md mx-auto leading-relaxed text-sm md:text-base">
            AI 赋能创意，一键生成场景与表情包
          </p>
        </div>

        <div className="w-full max-w-xs md:max-w-md space-y-4 md:space-y-6">
          {/* Main Action */}
          <button
            onClick={() => !featureDisabled && router.push("/create")}
            disabled={featureDisabled}
            className={`group relative w-full px-8 py-4 rounded-2xl font-semibold shadow-lg active:scale-95 transition-all overflow-hidden flex items-center justify-between ${
              featureDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-violet-600 text-white shadow-violet-200"
            }`}
          >
            {!featureDisabled && (
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            )}
            <div className="flex items-center gap-3 relative z-10">
              <div
                className={`p-2 rounded-lg ${
                  featureDisabled ? "bg-gray-200" : "bg-white/20"
                }`}
              >
                <Sparkles size={20} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">场景扩展</div>
                <div
                  className={`text-[10px] ${
                    featureDisabled ? "text-gray-400" : "opacity-80"
                  }`}
                >
                  {featureDisabled ? "待开放" : "换背景 / 讲故事"}
                </div>
              </div>
            </div>
            {featureDisabled ? (
              <Lock size={20} className="relative z-10 opacity-50" />
            ) : (
              <ChevronRight size={20} className="relative z-10 opacity-60" />
            )}
          </button>

          {/* Meme Action */}
          <button
            onClick={() => !featureDisabled && triggerFileInput()}
            disabled={featureDisabled}
            className={`group relative w-full px-8 py-4 rounded-2xl font-semibold shadow-md border active:scale-95 transition-all flex items-center justify-between ${
              featureDisabled
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-800 border-gray-100 hover:border-amber-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  featureDisabled
                    ? "bg-gray-200 text-gray-400"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                <Smile size={20} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">表情包制作</div>
                <div
                  className={`text-[10px] ${
                    featureDisabled ? "text-gray-400" : "text-gray-400"
                  }`}
                >
                  {featureDisabled ? "待开放" : "转贴纸 / 批量生成"}
                </div>
              </div>
            </div>
            {featureDisabled ? (
              <Lock size={20} className="text-gray-300" />
            ) : (
              <ChevronRight size={20} className="text-gray-300" />
            )}
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </div>
      <div className="h-20"></div>
    </div>
  );
}
