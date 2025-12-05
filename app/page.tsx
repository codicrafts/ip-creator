"use client";

import { useRouter } from "next/navigation";
import {
  Wand2,
  Sparkles,
  Smile,
  ChevronRight,
  Zap,
  Share2,
  ArrowDown,
  Bot,
  Layers,
  Palette,
  Rocket,
  Infinity,
  Film,
  Smartphone,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks"; // Updated import to include useAppSelector
import { setMemeDrafts, setActiveDraftIndex } from "@/store/slices/memeSlice";
import { setCreatePageMode } from "@/store/slices/appSlice"; // Added import
import { AnimationType } from "@/types";
import { isFeatureDisabled } from "@/lib/feature-flags";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector((state) => state.user.status); // Get user status
  const fileInputRef = useRef<HTMLInputElement>(null);
  const featureDisabled = isFeatureDisabled();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
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

  const scrollToFeatures = () => {
    const featuresElement = document.getElementById("features");
    featuresElement?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Navbar - Glass Effect */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="bg-linear-to-br from-violet-500 to-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-violet-200 transition-transform group-hover:scale-105">
              <Wand2
                size={22}
                className="group-hover:rotate-12 transition-transform"
              />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-violet-600 transition-colors">
              IP 创想坊
            </span>
          </div>
          {!scrolled && (
            <button
              onClick={() => router.push("/login")}
              className="hidden md:block px-6 py-2 rounded-full bg-white/50 hover:bg-white text-gray-900 text-sm font-medium transition-all backdrop-blur-sm border border-transparent hover:border-gray-200 shadow-sm hover:shadow"
            >
              登录 / 注册
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background Blobs - Light & Soft */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-200/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-violet-100 shadow-sm animate-fade-in-up">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
            </span>
            <span className="text-sm font-semibold text-violet-700 tracking-wide">
              AI 驱动的创意引擎 v1.0
            </span>
          </div>

          {/* Main Title */}
          <h1
            className="text-5xl md:text-8xl font-normal tracking-wide text-gray-900 animate-fade-in-up leading-[1.2] font-(family-name:--font-zcool)"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="block mb-2 text-gray-800">释放你的</span>
            <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-600 via-fuchsia-500 to-indigo-600 animate-gradient-x pb-2">
              无限创意潜能
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 leading-relaxed animate-fade-in-up font-medium"
            style={{ animationDelay: "0.2s" }}
          >
            零门槛驾驭顶尖设计力。一键生成沉浸式场景与爆款表情包，让每一个灵感瞬间落地，构建专属
            IP 宇宙。
          </p>

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-5 w-full max-w-lg mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={() => {
                if (featureDisabled) return;
                dispatch(setCreatePageMode("scene"));
                router.push("/create");
              }}
              disabled={featureDisabled}
              className={`group flex-1 relative px-8 py-4 rounded-2xl font-bold text-white shadow-xl shadow-violet-200 transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${
                featureDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-violet-600 to-indigo-600"
              }`}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative flex items-center justify-center gap-2">
                <Rocket className="w-5 h-5 animate-pulse" />
                <span className="text-lg">开始场景创作</span>
                {!featureDisabled && (
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </button>

            <button
              onClick={() => {
                if (featureDisabled) return;
                dispatch(setCreatePageMode("meme"));
                router.push("/create");
              }}
              disabled={featureDisabled}
              className={`group flex-1 relative px-8 py-4 rounded-2xl font-bold bg-white text-gray-800 shadow-lg border border-gray-100 transition-all hover:scale-[1.02] hover:border-amber-200 active:scale-[0.98] flex items-center justify-center gap-2 ${
                featureDisabled ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <Smile
                className={`w-6 h-6 ${
                  featureDisabled
                    ? ""
                    : "text-amber-500 group-hover:rotate-12 transition-transform"
                }`}
              />
              <span className="text-lg">制作表情包</span>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-16 hidden md:block animate-float">
            <button
              onClick={scrollToFeatures}
              className="p-3 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-violet-600 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <ArrowDown size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section - Second Screen */}
      <section id="features" className="py-32 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              全能创作工具箱
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
              集成了最先进的 AI 模型，为您提供从灵感到成品的完整创意工作流。
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {/* Feature 1: 一站式创意闭环 (All-in-One) */}
            <div className="group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] p-8 rounded-4xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-indigo-100 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                <Infinity size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                一站式创意闭环
              </h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                集成绘画、去背、动效、排版于一体。告别
                PS/AE，在一个页面完成从灵感到成品的全部工作。
              </p>
            </div>

            {/* Feature 2: 专属 IP 生态 (IP Ecosystem) */}
            <div className="group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] p-8 rounded-4xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-violet-100 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300 group-hover:bg-violet-600 group-hover:text-white">
                <Palette size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                专属 IP 生态
              </h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                针对性优化角色一致性。不仅仅是生成一张图，而是构建一套统一的 IP
                视觉识别系统。
              </p>
            </div>

            {/* Feature 3: 批量生产引擎 (Batch Processing) */}
            <div className="group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] p-8 rounded-4xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-blue-100 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                <Layers size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                批量生产引擎
              </h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                支持多分组 Prompt
                管理，一次性生成多套情绪素材，极大提升内容创作效率。
              </p>
            </div>

            {/* Feature 4: 动静结合表现力 (Motion/GIF) */}
            <div className="group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] p-8 rounded-4xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-pink-100 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300 group-hover:bg-pink-600 group-hover:text-white">
                <Film size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                动静结合表现力
              </h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                内置动效引擎，一键生成 GIF
                动图。让表情包“动”起来，在社交传播中获取更多流量。
              </p>
            </div>

            {/* Feature 5: 零门槛极速上手 (Easy to Use) */}
            <div className="group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] p-8 rounded-4xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-amber-100 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                零门槛极速上手
              </h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                直观的界面设计配合灵活的参数和自然语言交互，让您像聊天一样轻松创作，即刻上手。
              </p>
            </div>

            {/* Feature 6: 无缝连接国内生态 (Localization) */}
            <div className="group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] p-8 rounded-4xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-emerald-100 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                <Smartphone size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                无缝连接国内生态
              </h3>
              <p className="text-gray-500 leading-relaxed text-lg">
                原生支持微信登录与支付，生成的素材完美适配微信表情包与小红书尺寸。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase / CTA Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gray-900 z-0"></div>
        <div className="absolute inset-0 bg-linear-to-br from-violet-900/50 to-indigo-900/50 z-0"></div>
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-30 z-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-500 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <div className="inline-block mb-6 p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <div className="px-4 py-1 text-sm font-medium text-violet-200">
              ✨ 限时优惠
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            准备好开始创作了吗？
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            加入成千上万的创作者，体验 AI
            带来的无限可能。无需下载，打开浏览器即可使用。
          </p>
          <button
            onClick={() => {
              if (featureDisabled) return;
              if (userStatus === "LOGGED_IN") {
                dispatch(setCreatePageMode("scene"));
                router.push("/create");
              } else {
                router.push("/login");
              }
            }}
            className="px-12 py-5 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-violet-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
          >
            立即免费试用
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="mb-4 md:mb-0 flex items-center gap-2">
            <Layers size={16} className="text-gray-400" />
            <span>
              &copy; {new Date().getFullYear()} IP 创想坊. All rights reserved.
            </span>
          </div>
          <div className="flex gap-8 font-medium">
            <a
              href="/privacy"
              className="hover:text-violet-600 transition-colors"
            >
              隐私政策
            </a>
            <a
              href="/terms"
              className="hover:text-violet-600 transition-colors"
            >
              服务条款
            </a>
            <a
              href="/about"
              className="hover:text-violet-600 transition-colors"
            >
              关于我们
            </a>
          </div>
        </div>
      </footer>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
      />
    </div>
  );
}
