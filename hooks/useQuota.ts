import { useAppSelector } from "@/store/hooks";
import { UserTier } from "@/types";
import { UserStatus } from "@/store/slices/userSlice";
import { getTodayDateString, normalizeDateString } from "@/lib/date-utils";
import { getMembershipPlan } from "@/lib/membership";
import { FREE_DAILY_LIMIT } from "@/lib/constants";

const GUEST_DAILY_LIMIT = 0; // 游客没有额度

export function useQuota(type: "scene" | "meme") {
  const userTier = useAppSelector((state) => state.user.userTier);
  const userStatus = useAppSelector((state) => state.user.status);
  const sceneUsage = useAppSelector((state) => state.user.sceneUsage);
  const memeUsage = useAppSelector((state) => state.user.memeUsage);

  const usage = type === "scene" ? sceneUsage : memeUsage;
  const today = getTodayDateString();
  const normalizedToday = normalizeDateString(today);
  const normalizedUsageDate = normalizeDateString(usage.date);

  const getLimit = (): number => {
    if (userStatus === UserStatus.GUEST) return GUEST_DAILY_LIMIT;
    if (userTier === UserTier.FREE) return FREE_DAILY_LIMIT;

    const plan = getMembershipPlan(userTier);
    if (plan) {
      return type === "scene" ? plan.sceneQuota : plan.memeQuota;
    }

    return FREE_DAILY_LIMIT;
  };

  const remainingQuota = (): number => {
    // 只有免费用户才需要每天重置额度
    // 会员用户的额度是按月计算的（或不限时），这里信任后端返回的 usage.count
    if (userTier === UserTier.FREE && normalizedUsageDate !== normalizedToday) {
      return getLimit();
    }
    // 游客模式没有额度
    if (userStatus === UserStatus.GUEST) {
      return 0;
    }
    return Math.max(0, getLimit() - usage.count);
  };

  const isQuotaReached = (): boolean => {
    return remainingQuota() <= 0;
  };

  return {
    limit: getLimit(),
    remaining: remainingQuota(),
    isReached: isQuotaReached(),
    usage: usage.count,
    date: usage.date,
  };
}
