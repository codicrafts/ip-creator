/**
 * 会员计划配置
 * 成本：每张生成 0.025 美元（约 0.18 元，按汇率 7.3 计算）
 */

import { UserTier } from "@/types";

export interface MembershipPlan {
  id: UserTier;
  name: string;
  description: string;
  monthlyQuota: number; // 每月张数（场景扩展 + 表情包制作）
  sceneQuota: number; // 每月场景扩展张数
  memeQuota: number; // 每月表情包制作张数
  originalPrice: number; // 原价（元）
  firstMonthPrice: number; // 首月价格（元，6折）
  features: string[]; // 会员权益
  color: string; // 主题色
  icon: string; // 图标
  popular?: boolean; // 是否推荐
}

// 会员计划配置
// 成本计算：每张生成 0.025 美元（约 0.18 元，按汇率 7.3 计算）
// 基础会员：定价 69 元，可提供 380 张（69 ÷ 0.18 ≈ 383，取整 380）
// 标准会员：定价 229 元，可提供 1300 张（229 ÷ 0.18 ≈ 1272，取整 1300）
// 高级会员：定价 639 元，可提供 3500 张（639 ÷ 0.18 ≈ 3550，取整 3500）
// 分配比例：场景扩展 70%，表情包制作 30%
export const MEMBERSHIP_PLANS: Record<
  UserTier.BASIC | UserTier.STANDARD | UserTier.PREMIUM,
  MembershipPlan
> = {
  [UserTier.BASIC]: {
    id: UserTier.BASIC,
    name: "基础会员",
    description: "适合轻度使用的创作者",
    monthlyQuota: 380,
    sceneQuota: 266, // 70% 分配给场景扩展（380 × 0.7 = 266）
    memeQuota: 114, // 30% 分配给表情包制作（380 × 0.3 = 114）
    originalPrice: 69,
    firstMonthPrice: 41.4, // 首月6折（69 × 0.6 = 41.4）
    features: [
      "每月 266 张场景扩展",
      "每月 114 张表情包制作",
      "标准高清无水印输出",
      "保存最近 30 天创作历史",
      "支持基础风格模型",
    ],
    color: "blue",
    icon: "🥉",
  },
  [UserTier.STANDARD]: {
    id: UserTier.STANDARD,
    name: "标准会员",
    description: "适合日常创作的创作者",
    monthlyQuota: 1300,
    sceneQuota: 910, // 70% 分配给场景扩展（1300 × 0.7 = 910）
    memeQuota: 390, // 30% 分配给表情包制作（1300 × 0.3 = 390）
    originalPrice: 229,
    firstMonthPrice: 137.4, // 首月6折（229 × 0.6 = 137.4）
    features: [
      "每月 910 张场景扩展",
      "每月 390 张表情包制作",
      "支持批量生成功能",
      "2K 超清无损输出",
      "永久保存创作历史",
      "优先生成队列",
    ],
    color: "violet",
    icon: "🥈",
    popular: true, // 推荐
  },
  [UserTier.PREMIUM]: {
    id: UserTier.PREMIUM,
    name: "高级会员",
    description: "适合专业创作者和重度用户",
    monthlyQuota: 3500,
    sceneQuota: 2450, // 70% 分配给场景扩展（3500 × 0.7 = 2450）
    memeQuota: 1050, // 30% 分配给表情包制作（3500 × 0.3 = 1050）
    originalPrice: 639,
    firstMonthPrice: 383.4, // 首月6折（639 × 0.6 = 383.4）
    features: [
      "每月 2450 张场景扩展",
      "每月 1050 张表情包制作",
      "批量处理 & 一键打包导出",
      "专属 IP 角色一致性优化",
      "GIF 动图生成支持",
      "4K 极致画质输出",
      "极速生成通道",
    ],
    color: "amber",
    icon: "🥇",
  },
};

// 获取会员计划
export function getMembershipPlan(tier: UserTier): MembershipPlan | null {
  if (tier === UserTier.FREE) {
    return null;
  }
  return (
    MEMBERSHIP_PLANS[
      tier as UserTier.BASIC | UserTier.STANDARD | UserTier.PREMIUM
    ] || null
  );
}

// 获取所有付费会员计划（排除 FREE）
export function getPaidMembershipPlans(): MembershipPlan[] {
  return [
    MEMBERSHIP_PLANS[UserTier.BASIC],
    MEMBERSHIP_PLANS[UserTier.STANDARD],
    MEMBERSHIP_PLANS[UserTier.PREMIUM],
  ];
}

// 计算首月价格（6折）
export function calculateFirstMonthPrice(originalPrice: number): number {
  return Math.round(originalPrice * 0.6 * 10) / 10;
}

// 检查用户是否为首月（根据订单历史判断）
export function isFirstMonth(userId: string, orderHistory: any[]): boolean {
  // 如果用户没有付费订单历史，则为首月
  return orderHistory.length === 0;
}
