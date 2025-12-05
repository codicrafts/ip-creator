"use client";

import React, { useState } from "react";
import { Check, Crown, Sparkles } from "lucide-react";
import { UserTier } from "@/types";
import { getPaidMembershipPlans, MembershipPlan } from "@/lib/membership";
import { isPurchaseDisabled } from "@/lib/feature-flags";

interface MembershipPlansProps {
  selectedPlan?: UserTier;
  onSelectPlan: (plan: UserTier) => void;
  isFirstMonth?: boolean;
}

const MembershipPlans: React.FC<MembershipPlansProps> = ({
  selectedPlan,
  onSelectPlan,
  isFirstMonth = false,
}) => {
  const plans = getPaidMembershipPlans();
  // 移动端 tab 切换：默认显示推荐计划（标准会员），如果没有则显示第一个
  const defaultActiveTab = plans.find((p) => p.popular)?.id || plans[0]?.id;
  // 如果有选中的计划，优先显示选中的计划
  const initialActiveTab = selectedPlan || defaultActiveTab;
  const [activeTab, setActiveTab] = useState<UserTier>(initialActiveTab);
  const purchaseDisabled = isPurchaseDisabled();

  // 当 selectedPlan 变化时，同步更新 activeTab
  React.useEffect(() => {
    if (selectedPlan) {
      setActiveTab(selectedPlan);
    }
  }, [selectedPlan]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "border-blue-200 bg-blue-50 hover:border-blue-300",
      violet: "border-violet-200 bg-violet-50 hover:border-violet-300",
      amber: "border-amber-200 bg-amber-50 hover:border-amber-300",
    };
    return colors[color] || colors.blue;
  };

  const getSelectedColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "border-blue-500 bg-blue-100 ring-2 ring-blue-200",
      violet: "border-violet-500 bg-violet-100 ring-2 ring-violet-200",
      amber: "border-amber-500 bg-amber-100 ring-2 ring-amber-200",
    };
    return colors[color] || colors.blue;
  };

  const getPriceColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "text-blue-600",
      violet: "text-violet-600",
      amber: "text-amber-600",
    };
    return colors[color] || colors.blue;
  };

  // 渲染单个会员计划卡片
  const renderPlanCard = (
    plan: MembershipPlan,
    isMobileTab: boolean = false
  ) => {
    const isSelected = selectedPlan === plan.id;
    const price = isFirstMonth ? plan.firstMonthPrice : plan.originalPrice;
    const isPopular = plan.popular;

    return (
      <div
        key={plan.id}
        onClick={() => onSelectPlan(plan.id)}
        className={`
          relative rounded-xl md:rounded-2xl p-4 md:p-6 border-2 cursor-pointer transition-all flex flex-col
          ${
            isSelected
              ? getSelectedColorClasses(plan.color)
              : getColorClasses(plan.color)
          }
          ${isSelected ? "scale-105 shadow-lg" : "hover:scale-102"}
          ${isMobileTab ? "md:hidden" : "hidden md:flex"}
        `}
      >
        {/* 推荐标签 */}
        {isPopular && (
          <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-violet-500 to-violet-600 text-white text-[10px] md:text-xs font-bold px-3 md:px-4 py-0.5 md:py-1 rounded-full shadow-lg flex items-center gap-1">
            <Sparkles size={10} className="md:w-3 md:h-3" />
            推荐
          </div>
        )}

        {/* 首月优惠标签 */}
        {isFirstMonth && (
          <div className="absolute -top-2 md:-top-3 right-2 md:right-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:py-1 rounded-full shadow-md">
            首月6折
          </div>
        )}

        <div className="text-center mb-3 md:mb-4">
          <div className="text-3xl md:text-4xl mb-1 md:mb-2">{plan.icon}</div>
          <h3 className="font-bold text-base md:text-lg text-gray-800 mb-1">
            {plan.name}
          </h3>
          <p className="text-[10px] md:text-xs text-gray-500">
            {plan.description}
          </p>
        </div>

        {/* 价格 */}
        <div className="text-center mb-3 md:mb-4">
          <div className="flex items-baseline justify-center gap-1">
            <span
              className={`text-2xl md:text-3xl font-bold ${getPriceColor(
                plan.color
              )}`}
            >
              ¥{price}
            </span>
            <span className="text-xs md:text-sm text-gray-500">/月</span>
          </div>
          {isFirstMonth && (
            <div className="mt-1">
              <span className="text-[10px] md:text-xs text-gray-400 line-through">
                原价 ¥{plan.originalPrice}
              </span>
            </div>
          )}
        </div>

        {/* 权益列表 */}
        <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4 flex-1">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check
                size={14}
                className={`shrink-0 mt-0.5 md:w-4 md:h-4 ${getPriceColor(
                  plan.color
                )}`}
              />
              <span className="text-xs md:text-sm text-gray-700">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* 选择按钮 */}
        <button
          onClick={() => !purchaseDisabled && onSelectPlan(plan.id)}
          disabled={purchaseDisabled}
          className={`
            w-full py-2 md:py-2.5 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition-all mt-auto
            ${
              purchaseDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isSelected
                ? `bg-white ${getPriceColor(
                    plan.color
                  )} border-2 border-current`
                : `bg-gray-800 text-white hover:bg-gray-700`
            }
          `}
        >
          {purchaseDisabled ? "待开放" : isSelected ? "已选择" : "选择此计划"}
        </button>
      </div>
    );
  };

  return (
    <>
      {/* 移动端：Tab 切换 */}
      <div className="md:hidden">
        {/* Tab 导航 */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {plans.map((plan) => {
            const isActive = activeTab === plan.id;
            const isSelected = selectedPlan === plan.id;

            return (
              <button
                key={plan.id}
                onClick={() => setActiveTab(plan.id)}
                className={`
                  relative px-3 py-1.5 rounded-lg border transition-all text-xs font-medium shrink-0 whitespace-nowrap
                  ${
                    isActive
                      ? isSelected
                        ? `${getSelectedColorClasses(
                            plan.color
                          )} ${getPriceColor(plan.color)}`
                        : `${getColorClasses(plan.color)} ${getPriceColor(
                            plan.color
                          )} border-current`
                      : "border-gray-200 bg-white text-gray-600"
                  }
                `}
              >
                {plan.popular && isActive && (
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-violet-500 rounded-full border border-white"></div>
                )}
                {plan.name}
              </button>
            );
          })}
        </div>

        {/* Tab 内容：显示当前选中的计划详情 */}
        {plans.map((plan) => {
          if (plan.id === activeTab) {
            return renderPlanCard(plan, true);
          }
          return null;
        })}
      </div>

      {/* PC 端：Grid 布局 */}
      <div className="hidden md:grid md:grid-cols-3 gap-4 md:gap-6">
        {plans.map((plan) => renderPlanCard(plan, false))}
      </div>
    </>
  );
};

export default MembershipPlans;
