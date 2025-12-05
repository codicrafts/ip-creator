"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Phone,
  MessageSquare,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import {
  setUserInfo,
  setSceneUsage,
  setMemeUsage,
} from "@/store/slices/userSlice";
import { sendSmsCode, verifySmsCode, login, setPassword as setUserPassword } from "@/services/authService";
import { getUserInfo } from "@/services/userService";
import { UserTier } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginType, setLoginType] = useState<"sms" | "password">("sms");
  const [phone, setPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [settingPassword, setSettingPassword] = useState(false);
  const [newUserId, setNewUserId] = useState<string | null>(null);

  // 发送短信验证码
  const handleSendSmsCode = async () => {
    setError("");

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("请输入正确的手机号");
      return;
    }

    setSmsLoading(true);
    try {
      await sendSmsCode(phone);

      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || "发送验证码失败");
    } finally {
      setSmsLoading(false);
    }
  };

  // 验证码登录
  const handleSmsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        setError("请输入正确的手机号");
        setLoading(false);
        return;
      }

      // 验证验证码格式
      if (!/^\d{6}$/.test(smsCode)) {
        setError("请输入6位数字验证码");
        setLoading(false);
        return;
      }

      // 验证验证码并登录/注册
      const userData = await verifySmsCode(phone, smsCode);

      // 更新 Redux store
      dispatch(
        setUserInfo({
          userId: userData.userId,
          phone: userData.phone,
          userTier: userData.userTier as UserTier,
        })
      );
      dispatch(setSceneUsage(userData.sceneUsage));
      dispatch(setMemeUsage(userData.memeUsage));

      // 如果是新用户（首次注册），显示设置密码弹窗
      if (userData.isNewUser) {
        setNewUserId(userData.userId);
        setShowSetPasswordModal(true);
        setLoading(false);
        return;
      }

      // 老用户直接跳转到首页
      router.push("/");
    } catch (err: any) {
      setError(err.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  // 密码登录
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        setError("请输入正确的手机号");
        setLoading(false);
        return;
      }

      // 验证密码长度
      if (password.length < 6) {
        setError("密码至少6位");
        setLoading(false);
        return;
      }

      // 登录即注册：如果用户不存在会自动创建
      const userData = await login(phone, password);

      // 获取用户完整信息（包括使用次数）
      const userInfo = await getUserInfo(userData.userId);

      // 更新 Redux store
      dispatch(
        setUserInfo({
          userId: userInfo.userId || userData.userId,
          phone: userData.phone,
          userTier: userInfo.userTier as UserTier,
        })
      );
      dispatch(setSceneUsage(userInfo.sceneUsage));
      dispatch(setMemeUsage(userInfo.memeUsage));

      // 跳转到首页
      router.push("/");
    } catch (err: any) {
      setError(err.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-violet-50 to-white pb-24 md:pt-16">
      <header className="bg-white/80 backdrop-blur-sm p-4 md:hidden sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="font-bold text-lg text-gray-800 ml-2">登录/注册</h2>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 space-y-6">
            {/* 标题 */}
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                欢迎使用
              </h1>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* 登录方式切换 */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setLoginType("sms");
                  setError("");
                  setPassword("");
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  loginType === "sms"
                    ? "bg-white text-violet-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                验证码登录
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginType("password");
                  setError("");
                  setSmsCode("");
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  loginType === "password"
                    ? "bg-white text-violet-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                密码登录
              </button>
            </div>

            {/* 表单 */}
            {loginType === "sms" ? (
              <form onSubmit={handleSmsLogin} className="space-y-4">
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

                {/* 验证码 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    验证码
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <MessageSquare size={20} />
                      </div>
                      <input
                        type="text"
                        value={smsCode}
                        onChange={(e) =>
                          setSmsCode(
                            e.target.value.replace(/\D/g, "").slice(0, 6)
                          )
                        }
                        placeholder="请输入6位验证码"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                        required
                        maxLength={6}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendSmsCode}
                      disabled={smsLoading || countdown > 0}
                      className="px-4 py-3 bg-violet-100 text-violet-600 rounded-xl font-medium hover:bg-violet-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {countdown > 0
                        ? `${countdown}s`
                        : smsLoading
                        ? "发送中..."
                        : "获取验证码"}
                    </button>
                  </div>
                </div>

                {/* 提交按钮 */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-violet-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-200 hover:bg-violet-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "处理中..." : "登录/注册"}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                      type={showPassword ? "text" : "password"}
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
                  {loading ? "处理中..." : "登录/注册"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 设置密码弹窗（新用户首次登录/注册时） */}
      {showSetPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-gray-900">设置密码</h3>
            <p className="text-sm text-gray-600">
              为了您的账户安全，请设置一个密码。设置后可使用密码登录。
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="请输入密码（至少6位）"
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  确认密码
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请再次输入密码"
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={async () => {
                  // 跳过设置密码，直接进入
                  setShowSetPasswordModal(false);
                  router.push("/");
                }}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                disabled={settingPassword}
              >
                稍后设置
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!newUserId) return;

                  setError("");
                  setSettingPassword(true);

                  try {
                    // 验证密码长度
                    if (newPassword.length < 6) {
                      setError("密码至少6位");
                      setSettingPassword(false);
                      return;
                    }

                    // 验证两次密码是否一致
                    if (newPassword !== confirmPassword) {
                      setError("两次输入的密码不一致");
                      setSettingPassword(false);
                      return;
                    }

                    // 设置密码
                    await setUserPassword(newUserId, newPassword);

                    // 关闭弹窗并跳转
                    setShowSetPasswordModal(false);
                    router.push("/");
                  } catch (err: any) {
                    setError(err.message || "设置密码失败");
                  } finally {
                    setSettingPassword(false);
                  }
                }}
                disabled={settingPassword || !newPassword || !confirmPassword}
                className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {settingPassword ? "设置中..." : "确认设置"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
