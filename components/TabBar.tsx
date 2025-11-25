'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, User, Wand2 } from 'lucide-react';

const TabBar: React.FC = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isCreate = pathname === '/create' || pathname === '/upload';
  const isProfile = pathname === '/profile' || pathname === '/me';

  return (
    <>
      {/* Mobile Bottom TabBar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe-area shadow-lg z-50 h-16 flex items-center justify-around px-6 md:hidden">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center space-y-1 ${
            isHome ? 'text-violet-600' : 'text-gray-400'
          }`}
        >
          <Home size={24} strokeWidth={isHome ? 2.5 : 2} />
          <span className="text-[10px] font-medium">首页</span>
        </Link>

        <Link
          href="/create"
          className="flex flex-col items-center justify-center -mt-6"
        >
          <div className="bg-violet-600 text-white p-3 rounded-full shadow-violet-200 shadow-xl transform transition-transform active:scale-95">
              <PlusCircle size={32} />
          </div>
          <span className="text-[10px] font-medium text-gray-600 mt-1">创作</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center space-y-1 ${
            isProfile ? 'text-violet-600' : 'text-gray-400'
          }`}
        >
          <User size={24} strokeWidth={isProfile ? 2.5 : 2} />
          <span className="text-[10px] font-medium">我的</span>
        </Link>
      </div>

      {/* PC Top Navigation */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 bg-white border-b border-gray-100 shadow-sm z-50 h-16 items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors">
          <Wand2 size={24} />
          <span className="font-bold text-lg">IP 创想坊</span>
        </Link>
        
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isHome
                ? 'bg-violet-50 text-violet-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Home size={18} />
              <span>首页</span>
            </div>
          </Link>

          <Link
            href="/create"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isCreate
                ? 'bg-violet-50 text-violet-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <PlusCircle size={18} />
              <span>创作</span>
            </div>
          </Link>

          <Link
            href="/profile"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isProfile
                ? 'bg-violet-50 text-violet-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>我的</span>
            </div>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default TabBar;