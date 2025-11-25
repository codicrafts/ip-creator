'use client';

import React from 'react';
import { X, Zap, LogIn, Crown } from 'lucide-react';
import { UserStatus } from '@/store/slices/userSlice';

interface QuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
  onUpgrade?: () => void;
  userStatus: UserStatus;
  remainingQuota: number;
  limit: number;
  type: 'scene' | 'meme'; // 场景扩展或表情包制作
}

const QuotaModal: React.FC<QuotaModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onUpgrade,
  userStatus,
  remainingQuota,
  limit,
  type,
}) => {
  if (!isOpen) return null;

  const typeText = type === 'scene' ? '场景扩展' : '表情包制作';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Zap size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                额度不足
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">剩余 {typeText} 额度</p>
                <p className="text-3xl font-bold text-gray-900">
                  {remainingQuota} <span className="text-lg text-gray-500">/ {limit}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {userStatus === UserStatus.GUEST ? (
                <>
                  <p className="text-gray-700 text-center">
                    游客体验次数已用完！
                  </p>
                  <p className="text-sm text-gray-500 text-center">
                    登录后可获得每日 5 次 {typeText} 额度
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onLogin?.();
                    }}
                    className="w-full py-3 rounded-xl font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn size={18} />
                    立即登录
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-700 text-center">
                    {typeText}额度不足！
                  </p>
                  <p className="text-sm text-gray-500 text-center">
                    升级会员可获取每日 50 次 {typeText} 额度
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onUpgrade?.();
                    }}
                    className="w-full py-3 rounded-xl font-semibold bg-amber-400 text-amber-900 hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
                  >
                    <Crown size={18} />
                    升级会员
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotaModal;

