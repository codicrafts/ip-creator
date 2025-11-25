'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Download, Smile, RefreshCcw } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLoadingState, setCurrentView } from '@/store/slices/appSlice';
import { LoadingState, AppView } from '@/types';
import { resetImageState, setResultImage } from '@/store/slices/imageSlice';
import { setMemeDrafts, setActiveDraftIndex } from '@/store/slices/memeSlice';
import { AnimationType } from '@/types';
import Loader from '@/components/Loader';

export default function ResultPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loadingState = useAppSelector((state) => state.app.loadingState);
  const errorMsg = useAppSelector((state) => state.app.errorMsg);
  const resultImage = useAppSelector((state) => state.image.resultImage);

  const handleReset = () => {
    dispatch(resetImageState());
    dispatch(setResultImage(null));
    dispatch(setLoadingState(LoadingState.IDLE));
    router.push('/create');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 pb-24 md:pt-16">
      <header className="bg-transparent px-4 md:px-8 py-3 absolute top-0 md:top-16 left-0 right-0 z-20 flex items-center justify-between max-w-7xl mx-auto w-full">
        <button
          onClick={() => router.push('/edit')}
          className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative">
        {loadingState === LoadingState.GENERATING && (
          <div className="text-white">
            <Loader message="正在为你的IP构建新世界..." />
          </div>
        )}

        {loadingState === LoadingState.ERROR && (
          <div className="text-center space-y-4 bg-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-md border border-white/10 max-w-2xl">
            <div className="text-red-400 text-5xl mb-2">:(</div>
            <p className="text-white/90 font-medium">{errorMsg || '生成失败'}</p>
            <button
              onClick={() => router.push('/edit')}
              className="px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-100"
            >
              返回修改
            </button>
          </div>
        )}

        {loadingState === LoadingState.SUCCESS && resultImage && (
          <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl animate-in fade-in zoom-in duration-500">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-violet-900/50 border border-white/10 bg-gray-800">
              <img
                src={resultImage}
                alt="Generated"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href={resultImage}
                download={`ip-creative-${Date.now()}.png`}
                className={`col-span-2 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                  loadingState === LoadingState.SUCCESS && resultImage
                    ? 'bg-white text-gray-900 hover:bg-gray-100 cursor-pointer'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed pointer-events-none'
                }`}
                onClick={(e) => {
                  if (loadingState !== LoadingState.SUCCESS || !resultImage) {
                    e.preventDefault();
                  }
                }}
              >
                <Download size={18} /> 保存图片
              </a>
              <button
                onClick={() => {
                  dispatch(setMemeDrafts([
                    {
                      id: Date.now().toString(),
                      sourceUrl: resultImage!,
                      generatedUrl: null,
                      text: '神评',
                      moodPrompt: '滑稽表情',
                      status: 'pending',
                      animation: AnimationType.NONE,
                    },
                  ]));
                  dispatch(setActiveDraftIndex(0));
                  router.push('/meme-editor');
                }}
                className="bg-amber-400 text-amber-900 border border-amber-500/20 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors"
              >
                <Smile size={18} /> 转表情包
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-800 text-white border border-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
              >
                <RefreshCcw size={18} /> 再来一次
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

