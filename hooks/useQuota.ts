import { useAppSelector } from "@/store/hooks";
import { UserTier } from "@/types";
import { UserStatus } from "@/store/slices/userSlice";
import { getTodayDateString, normalizeDateString } from "@/lib/date-utils";
import { getMembershipPlan } from "@/lib/membership";

const GUEST_DAILY_LIMIT = 1;
const FREE_DAILY_LIMIT = 5;

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
    if (normalizedUsageDate !== normalizedToday) {
      return getLimit();
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
