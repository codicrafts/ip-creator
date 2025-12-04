import { useAppSelector } from "@/store/hooks";
import { UserTier } from "@/types";
import { getTodayDateString, normalizeDateString } from "@/lib/date-utils";

const GUEST_DAILY_LIMIT = 1;
const FREE_DAILY_LIMIT = 5;
const PREMIUM_DAILY_LIMIT = 50;
const VIP_DAILY_LIMIT = 200;

export function useQuota(type: "scene" | "meme") {
  const userTier = useAppSelector((state) => state.user.userTier);
  const sceneUsage = useAppSelector((state) => state.user.sceneUsage);
  const memeUsage = useAppSelector((state) => state.user.memeUsage);

  const usage = type === "scene" ? sceneUsage : memeUsage;
  const today = getTodayDateString();
  const normalizedToday = normalizeDateString(today);
  const normalizedUsageDate = normalizeDateString(usage.date);

  const getLimit = (): number => {
    if (userTier === UserTier.GUEST) return GUEST_DAILY_LIMIT;
    if (userTier === UserTier.FREE) return FREE_DAILY_LIMIT;
    if (userTier === UserTier.PREMIUM) return PREMIUM_DAILY_LIMIT;
    if (userTier === UserTier.VIP) return VIP_DAILY_LIMIT;
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

