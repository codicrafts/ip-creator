'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { setUserInfo, setSceneUsage, setMemeUsage } from '@/store/slices/userSlice';
import { login } from '@/services/authService';
import { getUserInfo } from '@/services/userService';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        setError('请输入正确的手机号');
        setLoading(false);
        return;
      }

      // 验证密码长度
      if (password.length < 6) {
        setError('密码至少6位');
        setLoading(false);
        return;
      }

      // 登录即注册：如果用户不存在会自动创建
      const userData = await login(phone, password);

      // 获取用户完整信息（包括使用次数）
      const userInfo = await getUserInfo(userData.userId);

      // 更新 Redux store
      dispatch(setUserInfo({
        userId: userInfo.userId || userData.userId,
        phone: userData.phone,
        userTier: userInfo.userTier,
      }));
      dispatch(setSceneUsage(userInfo.sceneUsage));
      dispatch(setMemeUsage(userInfo.memeUsage));

      // 跳转到首页
      router.push('/');
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-violet-50 to-white pb-24 md:pt-16">
      <header className="bg-white/80 backdrop-blur-sm p-4 md:hidden sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="font-bold text-lg text-gray-800 ml-2">
          登录
        </h2>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 space-y-6">
            {/* 标题 */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                欢迎使用
              </h1>
              <p className="text-sm text-gray-500">
                登录即注册，首次登录将自动创建账号
              </p>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 手机号 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  手机号
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone size={20} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入手机号"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* 密码 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码（至少6位）"
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-violet-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-200 hover:bg-violet-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '处理中...' : '登录'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

