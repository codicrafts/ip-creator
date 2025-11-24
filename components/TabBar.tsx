import React from 'react';
import { Home, PlusCircle, User } from 'lucide-react';
import { AppView } from '../types';

interface TabBarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const TabBar: React.FC<TabBarProps> = ({ currentView, onChangeView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe-area shadow-lg z-50 h-16 flex items-center justify-around px-6">
      <button
        onClick={() => onChangeView(AppView.HOME)}
        className={`flex flex-col items-center justify-center space-y-1 ${
          currentView === AppView.HOME ? 'text-violet-600' : 'text-gray-400'
        }`}
      >
        <Home size={24} strokeWidth={currentView === AppView.HOME ? 2.5 : 2} />
        <span className="text-[10px] font-medium">首页</span>
      </button>

      <button
        onClick={() => onChangeView(AppView.UPLOAD)}
        className="flex flex-col items-center justify-center -mt-6"
      >
        <div className="bg-violet-600 text-white p-3 rounded-full shadow-violet-200 shadow-xl transform transition-transform active:scale-95">
            <PlusCircle size={32} />
        </div>
        <span className="text-[10px] font-medium text-gray-600 mt-1">创作</span>
      </button>

      <button
        onClick={() => onChangeView(AppView.PROFILE)}
        className={`flex flex-col items-center justify-center space-y-1 ${
          currentView === AppView.PROFILE ? 'text-violet-600' : 'text-gray-400'
        }`}
      >
        <User size={24} strokeWidth={currentView === AppView.PROFILE ? 2.5 : 2} />
        <span className="text-[10px] font-medium">我的</span>
      </button>
    </div>
  );
};

export default TabBar;