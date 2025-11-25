'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setSourceImage } from '@/store/slices/imageSlice';
import { saveSourceImage } from '@/lib/image-storage';
import { setCurrentView, AppView } from '@/store/slices/appSlice';
import { setMemeDrafts, setActiveDraftIndex } from '@/store/slices/memeSlice';
import { AnimationType } from '@/types';

export default function CreatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        const mimeType = file.type;
        
        // 保存到 Redux
        dispatch(setSourceImage({
          image: imageData,
          mimeType: mimeType,
        }));
        
        // 保存到 localStorage（每次进入 edit 都会替换最新的图片）
        saveSourceImage(imageData, mimeType);
        
        // 从 /create 页面上传的文件，应该跳转到场景扩展编辑页
        router.push('/edit');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 md:pt-16">
      <header className="bg-white p-4 md:hidden sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center justify-center relative">
        <button
          onClick={() => router.push('/')}
          className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="font-bold text-lg text-gray-800">上传素材</h2>
      </header>

      <div className="flex-1 p-6 md:p-12 flex flex-col justify-center max-w-4xl mx-auto w-full">
        <div
          onClick={triggerFileInput}
          className="bg-white border-2 border-dashed border-violet-200 rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-violet-50 hover:border-violet-400 transition-all group min-h-[320px] md:min-h-[400px]"
        >
          <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div className="text-center space-y-2">
            <p className="font-semibold text-gray-700">点击上传图片</p>
            <p className="text-xs text-gray-400">支持 JPG, PNG (最大 5MB)</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}

