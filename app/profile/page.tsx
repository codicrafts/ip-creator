"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Crown, Zap, LogOut } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setIsPaymentModalOpen } from "@/store/slices/appSlice";
import {
  setUserTier,
  clearUserInfo,
  setSceneUsage,
  setMemeUsage,
  setMembershipExpiresAt,
} from "@/store/slices/userSlice";
import { logout } from "@/services/authService";
import { getUserInfo } from "@/services/userService";
import { UserTier } from "@/types";
import PaymentModal from "@/components/PaymentModal";
import { getMembershipPlan, getPaidMembershipPlans } from "@/lib/membership";
import MembershipPlans from "@/components/MembershipPlans";
import { isFeatureDisabled } from "@/lib/feature-flags";
import { FREE_DAILY_LIMIT } from "@/lib/constants";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const hasRefreshedRef = useRef(false);
  const userStatus = useAppSelector((state) => state.user.status);
  const userId = useAppSelector((state) => state.user.userId);
  const phone = useAppSelector((state) => state.user.phone);
  const userTier = useAppSelector((state) => state.user.userTier);
  const isPremium = [
    UserTier.BASIC,
    UserTier.STANDARD,
    UserTier.PREMIUM,
  ].includes(userTier);
  const sceneUsage = useAppSelector((state) => state.user.sceneUsage);
  const memeUsage = useAppSelector((state) => state.user.memeUsage);
  const membershipExpiresAt = useAppSelector(
    (state) => state.user.membershipExpiresAt
  );
  const history = useAppSelector((state) => state.image.history);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);
  const isPaymentModalOpen = useAppSelector(
    (state) => state.app.isPaymentModalOpen
  );
  const [preselectedPlan, setPreselectedPlan] = useState<UserTier | undefined>(
    undefined
  );
  const featureDisabled = isFeatureDisabled();

  // 页面加载时刷新用户信息（特别是从支付成功页面跳转过来时）
  // useEffect(() => {
  //   // 检查是否有刷新标志（从支付成功页面跳转过来）
  //   const shouldRefresh = searchParams.get("refresh") === "true";
  //
  //   // 如果是从支付成功页面跳转过来，或者用户已登录，则刷新用户信息
  //   if (userStatus === "LOGGED_IN" && userId) {
  //     // 如果有 refresh 参数，立即刷新；或者如果是会员但 membershipExpiresAt 为空，也需要刷新
  //     const needsRefresh = shouldRefresh || (isPremium && !membershipExpiresAt);
  //
  //     if (needsRefresh && !hasRefreshedRef.current) {
  //       hasRefreshedRef.current = true;
  //       setIsLoadingUserInfo(true);
  //
  //       // 刷新用户信息
  //       getUserInfo(userId)
  //         .then((userInfo) => {
  //           console.log("[Profile] 刷新用户信息成功:", userInfo);
  //           dispatch(setUserTier(userInfo.userTier));
  //           dispatch(setSceneUsage(userInfo.sceneUsage));
  //           dispatch(setMemeUsage(userInfo.memeUsage));
  //           if (userInfo.membershipExpiresAt !== undefined) {
  //             dispatch(setMembershipExpiresAt(userInfo.membershipExpiresAt));
  //           }
  //           setIsLoadingUserInfo(false);
  //
  //           // 如果有 refresh 参数，清除它
  //           if (shouldRefresh) {
  //             router.replace("/profile", { scroll: false });
  //           }
  //         })
  //         .catch((err) => {
  //           console.error("[Profile] 刷新用户信息失败:", err);
  //           setIsLoadingUserInfo(false);
  //         });
  //     } else {
  //       // 如果不需要刷新，确保 loading 状态为 false
  //       setIsLoadingUserInfo(false);
  //     }
  //   } else {
  //     setIsLoadingUserInfo(false);
  //   }
  // }, [
  //   userStatus,
  //   userId,
  //   searchParams,
  //   router,
  //   dispatch,
  //   isPremium,
  //   membershipExpiresAt,
  // ]);

  // 如果用户是会员但 membershipExpiresAt 为空，定期检查用户信息变化（用于支付成功后自动刷新）
  useEffect(() => {
    if (userStatus !== "LOGGED_IN" || !userId) {
      return;
    }

    // 如果用户是会员但 membershipExpiresAt 为空，可能是刚支付成功但还没刷新
    // 定期检查用户信息是否有变化
    if (!isPremium || membershipExpiresAt) {
      return;
    }

    console.log(
      "[Profile] 用户是会员但 membershipExpiresAt 为空，开始定期检查用户信息"
    );
    let pollCount = 0;
    const maxPollCount = 15; // 最多检查15次（30秒）
    const pollInterval = 2000; // 每2秒检查一次

    const pollTimer = setInterval(async () => {
      try {
        pollCount++;
        console.log(`[Profile] 检查用户信息变化 (第 ${pollCount} 次)`);

        // SSR 已获取用户信息，无需再次请求
        // const userInfo = await getUserInfo(userId);
        // dispatch(setUserTier(userInfo.userTier));
        // dispatch(setSceneUsage(userInfo.sceneUsage));
        // dispatch(setMemeUsage(userInfo.memeUsage));
        // if (userInfo.membershipExpiresAt !== undefined) {
        //   dispatch(setMembershipExpiresAt(userInfo.membershipExpiresAt));
        // }

        // 如果检测到 membershipExpiresAt 已更新，说明支付成功
        // if (userInfo.membershipExpiresAt) {
        //   console.log(
        //     "[Profile] ✅ 检测到用户信息已更新（membershipExpiresAt 已设置），刷新页面"
        //   );
        //   clearInterval(pollTimer);

        //   // 硬刷新页面
        //   window.location.reload();
        //   return;
        // }

        // 如果已达到最大轮询次数，停止轮询
        if (pollCount >= maxPollCount) {
          console.log("[Profile] ⏱️ 达到最大轮询次数，停止检查");
          clearInterval(pollTimer);
        }
      } catch (err) {
        console.error("[Profile] ❌ 检查用户信息失败:", err);
        if (pollCount >= maxPollCount) {
          clearInterval(pollTimer);
        }
      }
    }, pollInterval);

    return () => {
      clearInterval(pollTimer);
    };
  }, [userStatus, userId, isPremium, membershipExpiresAt]);

  // 获取会员计划信息
  const membershipPlan =
    isPremium && userTier !== UserTier.FREE
      ? getMembershipPlan(userTier)
      : null;

  // 计算额度限制
  const GUEST_DAILY_LIMIT = 0; // 游客0次
  let sceneLimit = FREE_DAILY_LIMIT;
  let memeLimit = FREE_DAILY_LIMIT;
  let isMonthly = false; // 是否为按月额度

  if (isPremium && membershipPlan) {
    sceneLimit = membershipPlan.sceneQuota;
    memeLimit = membershipPlan.memeQuota;
    isMonthly = true; // 会员按月计算
  } else if (userStatus === "LOGGED_IN") {
    sceneLimit = FREE_DAILY_LIMIT;
    memeLimit = FREE_DAILY_LIMIT;
  } else {
    sceneLimit = GUEST_DAILY_LIMIT;
    memeLimit = GUEST_DAILY_LIMIT;
  }

  // 直接使用后端返回的 count（后端已处理日期判断和重置）
  const sceneUsed = sceneUsage.count || 0;
  const memeUsed = memeUsage.count || 0;
  const sceneRemaining = Math.max(0, sceneLimit - sceneUsed);
  const memeRemaining = Math.max(0, memeLimit - memeUsed);
  const scenePercentage = Math.min(100, (sceneUsed / sceneLimit) * 100);
  const memePercentage = Math.min(100, (memeUsed / memeLimit) * 100);

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ backgroundColor: "#f9fafb" }}
    >
      <div
        className="flex flex-col min-h-screen bg-gray-50 pb-24 md:pt-16"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* User Card */}
          <div
            className={`relative rounded-3xl p-6 text-white overflow-hidden shadow-lg transition-all duration-500 ${
              membershipPlan
                ? membershipPlan.id === UserTier.BASIC
                  ? "bg-linear-to-br from-blue-500 to-blue-600 shadow-blue-200"
                  : membershipPlan.id === UserTier.STANDARD
                  ? "bg-linear-to-br from-violet-500 to-violet-600 shadow-violet-200"
                  : membershipPlan.id === UserTier.PREMIUM
                  ? "bg-linear-to-br from-amber-500 via-amber-600 to-orange-600 shadow-amber-200"
                  : "bg-linear-to-br from-slate-800 to-slate-900 shadow-slate-200"
                : "bg-linear-to-br from-violet-500 to-violet-600 shadow-violet-200"
            }`}
          >
            {membershipPlan && (
              <div className="absolute -right-8 -top-8 text-white/10">
                <Crown size={120} />
              </div>
            )}

            <div className="relative z-10 flex items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl md:text-2xl font-bold border-2 border-white/30 shrink-0">
                  {membershipPlan ? membershipPlan.icon : "🎨"}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-lg md:text-xl truncate">
                    {isPremium && membershipPlan
                      ? membershipPlan.name
                      : userStatus === "LOGGED_IN"
                      ? "普通用户"
                      : "游客"}
                  </h3>
                  <p className="text-white/80 text-[10px] md:text-xs flex items-center gap-1 mt-1 flex-wrap">
                    {userStatus === "LOGGED_IN" && phone ? (
                      <>
                        ID: {phone}
                        {membershipPlan && (
                          <span
                            className={`text-[10px] font-bold px-1.5 rounded ml-1 ${
                              membershipPlan.id === UserTier.BASIC
                                ? "bg-blue-300 text-blue-900"
                                : membershipPlan.id === UserTier.STANDARD
                                ? "bg-violet-300 text-violet-900"
                                : membershipPlan.id === UserTier.PREMIUM
                                ? "bg-amber-300 text-amber-900"
                                : "bg-amber-400 text-amber-900"
                            }`}
                          >
                            {membershipPlan.icon} {membershipPlan.name}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        ID: 游客
                        {membershipPlan && (
                          <span
                            className={`text-[10px] font-bold px-1.5 rounded ml-1 ${
                              membershipPlan.id === UserTier.BASIC
                                ? "bg-blue-300 text-blue-900"
                                : membershipPlan.id === UserTier.STANDARD
                                ? "bg-violet-300 text-violet-900"
                                : membershipPlan.id === UserTier.PREMIUM
                                ? "bg-amber-300 text-amber-900"
                                : "bg-amber-400 text-amber-900"
                            }`}
                          >
                            {membershipPlan.icon} {membershipPlan.name}
                          </span>
                        )}
                      </>
                    )}
                  </p>
                </div>
              </div>
              {userStatus === "LOGGED_IN" && (
                <button
                  onClick={async () => {
                    await logout();
                    dispatch(clearUserInfo());
                    router.push("/");
                  }}
                  className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2 transition-colors bg-white/10 hover:bg-white/20 text-white border border-white/20 whitespace-nowrap shrink-0"
                >
                  <LogOut size={14} className="md:w-4 md:h-4" />
                  <span className="hidden sm:inline">退出登录</span>
                  <span className="sm:hidden">退出</span>
                </button>
              )}
            </div>

            {userStatus === "LOGGED_IN" && (
            <div className="relative z-10 space-y-3">
              {/* 场景扩展额度 */}
              <div className="bg-black/20 rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] md:text-xs text-white/80">
                    场景扩展额度
                  </span>
                  <span className="font-mono font-bold text-lg md:text-xl">
                    {sceneRemaining}{" "}
                    <span className="text-xs md:text-sm text-white/60">
                      / {sceneLimit}
                    </span>
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      membershipPlan
                        ? membershipPlan.id === UserTier.BASIC
                          ? "bg-blue-300"
                          : membershipPlan.id === UserTier.STANDARD
                          ? "bg-violet-300"
                          : membershipPlan.id === UserTier.PREMIUM
                          ? "bg-amber-300"
                          : "bg-amber-400"
                        : "bg-white"
                    }`}
                    style={{ width: `${100 - scenePercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* 表情包制作额度 */}
              <div className="bg-black/20 rounded-xl md:rounded-2xl p-3 md:p-4 backdrop-blur-sm">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] md:text-xs text-white/80">
                    表情包制作额度
                  </span>
                  <span className="font-mono font-bold text-lg md:text-xl">
                    {memeRemaining}{" "}
                    <span className="text-xs md:text-sm text-white/60">
                      / {memeLimit}
                    </span>
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      membershipPlan
                        ? membershipPlan.id === UserTier.BASIC
                          ? "bg-blue-300"
                          : membershipPlan.id === UserTier.STANDARD
                          ? "bg-violet-300"
                          : membershipPlan.id === UserTier.PREMIUM
                          ? "bg-amber-300"
                          : "bg-amber-400"
                        : "bg-white"
                    }`}
                    style={{ width: `${100 - memePercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* 显示到期时间或重置提示 */}
              {isPremium && membershipExpiresAt ? (
                <p className="text-[10px] text-white/60 text-right">
                  到期时间:{" "}
                  {new Date(membershipExpiresAt).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
              ) : !isPremium ? (
                <p className="text-[10px] text-white/60 text-right">
                  每日 00:00 重置
                </p>
              ) : null}
            </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              {userStatus === "GUEST" && (
                <button
                  onClick={() => router.push("/login")}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <Zap size={16} /> 登录获取更多额度
                </button>
              )}
            </div>
          </div>

          {/* 会员计划展示（对非会员和未登录用户展示） */}
          {!isPremium && (
            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <Crown size={18} className="md:w-5 md:h-5 text-amber-500" />
                <h3 className="font-bold text-base md:text-lg text-gray-800">
                  会员权益
                </h3>
              </div>
              <MembershipPlans
                selectedPlan={preselectedPlan}
                onSelectPlan={(planId) => {
                  if (userStatus !== "LOGGED_IN") {
                    router.push("/login");
                    return;
                  }
                  setPreselectedPlan(planId);
                  dispatch(setIsPaymentModalOpen(true));
                }}
                isFirstMonth={true}
              />
            </div>
          )}

          {/* History Link Section */}
          {userStatus === "LOGGED_IN" && (
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-violet-100 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={20} className="md:w-6 md:h-6 text-violet-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-base md:text-lg text-gray-800 truncate">
                    创作历史
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5 truncate">
                    {history.length > 0
                      ? `共 ${history.length} 条作品`
                      : "暂无作品"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/history")}
                  className="px-4 py-2 md:px-6 md:py-2.5 bg-violet-600 text-white rounded-lg md:rounded-xl font-semibold text-xs md:text-sm hover:bg-violet-700 transition-colors flex items-center gap-1.5 md:gap-2 shrink-0"
              >
                <Clock size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">查看全部</span>
                <span className="sm:hidden">查看</span>
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Payment Modal - 将在 PaymentModal 中显示会员计划选择 */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setPreselectedPlan(undefined);
          dispatch(setIsPaymentModalOpen(false));
        }}
        onSuccess={() => {
          // 支付成功后，PaymentModal 会直接刷新页面，这里不需要做任何处理
          setPreselectedPlan(undefined);
          dispatch(setIsPaymentModalOpen(false));
        }}
        preselectedPlan={preselectedPlan}
      />
    </div>
  );
}
