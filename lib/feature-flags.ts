/**
 * 功能开关配置
 * 用于控制生产环境中的功能开放状态
 *
 * 使用说明：
 * 1. 生产环境：默认启用"待开放"模式（NODE_ENV === "production"）
 * 2. 本地开发：默认不启用"待开放"模式（功能正常）
 * 3. 本地模拟生产环境：设置环境变量 NEXT_PUBLIC_FEATURE_DISABLED=true
 *
 * 示例：
 * - 在 .env.local 中添加：NEXT_PUBLIC_FEATURE_DISABLED=true
 * - 或者在启动时：NEXT_PUBLIC_FEATURE_DISABLED=true pnpm dev
 *
 * 影响范围：
 * - 首页：场景扩展和表情包入口置灰，显示"待开放"
 * - 资源库页面：显示"待开放"提示
 * - 创作页面：显示"待开放"提示
 * - 我的页面：会员计划购买按钮置灰，显示"待开放"
 */

/**
 * 是否启用"待开放"模式
 * 在生产环境中设置为 true，在本地开发环境中设置为 false
 * 可以通过环境变量 NEXT_PUBLIC_FEATURE_DISABLED 来控制
 * 设置为 "true" 时，会禁用主要功能并显示"待开放"提示
 */
export const isFeatureDisabled = (): boolean => {
  // 线上环境放开所有功能
  return false;
};
