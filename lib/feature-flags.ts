/**
 * 功能开关配置
 * 用于控制生产环境中的功能开放状态
 */

/**
 * 判断是否为线上生产环境
 *
 * 判断方式（按优先级）：
 * 1. NODE_ENV=production（Next.js 生产环境）
 * 2. VERCEL_ENV=production（Vercel 生产环境，仅在服务端可用）
 * 3. 域名匹配（如果配置了 NEXT_PUBLIC_PRODUCTION_DOMAIN，仅在客户端可用）
 */
function isProduction(): boolean {
  // 检查 NODE_ENV（服务端和客户端都可用）
  // 注意：在客户端，Next.js 会将 NODE_ENV 替换为实际值
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") {
    return true;
  }

  // 检查 VERCEL_ENV（仅在服务端可用，Vercel 部署平台）
  // Vercel 环境：development, preview, production
  if (
    typeof process !== "undefined" &&
    process.env.VERCEL_ENV === "production"
  ) {
    return true;
  }

  // 客户端：检查域名（如果配置了生产域名）
  if (typeof window !== "undefined") {
    const productionDomain =
      typeof process !== "undefined"
        ? process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN
        : undefined;
    if (productionDomain) {
      const currentHost = window.location.hostname;
      // 支持精确匹配或子域名匹配
      if (
        currentHost === productionDomain ||
        currentHost.endsWith(`.${productionDomain}`)
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 是否禁用购买功能（仅影响"选择此计划"按钮）
 * 在生产环境中返回 true，在本地开发环境中返回 false
 *
 * 使用场景：
 * - MembershipPlans 组件中的"选择此计划"按钮
 * - PaymentModal 组件中的支付按钮
 */
export const isPurchaseDisabled = (): boolean => {
  return isProduction();
};

/**
 * 是否启用"待开放"模式（其他功能）
 * 默认返回 false，不影响其他功能
 */
export const isFeatureDisabled = (): boolean => {
  // 默认不禁用其他功能
  return false;
};
