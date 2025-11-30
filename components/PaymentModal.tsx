"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  CreditCard,
  Smartphone,
  Loader2,
  CheckCircle,
  XCircle,
  QrCode,
  Sparkles,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { PaymentMethod, CreateOrderRequest, UserTier } from "@/types";
import {
  createPaymentOrder,
  launchWechatPay,
  launchAlipay,
} from "@/services/paymentService";
import { getUserId } from "@/lib/cookies";
import MembershipPlans from "./MembershipPlans";
import { getMembershipPlan, getPaidMembershipPlans } from "@/lib/membership";
import { isFeatureDisabled } from "@/lib/feature-flags";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tier: UserTier) => void;
  preselectedPlan?: UserTier; // 预选的会员计划
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preselectedPlan,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<UserTier | null>(
    preselectedPlan || null
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isFirstMonth, setIsFirstMonth] = useState(true); // 默认首月，后续可以从订单历史判断
  const [isMobile, setIsMobile] = useState(false);
  const pollIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const featureDisabled = isFeatureDisabled();

  // 检测移动端
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // handleClose 必须在 useEffect 之前定义
  const handleClose = useCallback(() => {
    if (!isProcessing) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      setSelectedPlan(preselectedPlan || null); // 重置为预选计划或 null
      setSelectedMethod(null);
      setError(null);
      setPaymentStatus("idle");
      setQrCodeUrl(null);
      onClose();
    }
  }, [isProcessing, onClose, preselectedPlan]);

  // 当 preselectedPlan 变化时，更新 selectedPlan
  useEffect(() => {
    if (preselectedPlan && isOpen) {
      setSelectedPlan(preselectedPlan);
    }
  }, [preselectedPlan, isOpen]);

  // 清理轮询定时器
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  const plan = selectedPlan ? getMembershipPlan(selectedPlan) : null;
  const amount = plan
    ? isFirstMonth
      ? plan.firstMonthPrice
      : plan.originalPrice
    : 0;

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError("请选择会员计划");
      return;
    }

    if (!selectedMethod) {
      setError("请选择支付方式");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPaymentStatus("processing");

    try {
      const planInfo = getMembershipPlan(selectedPlan);
      if (!planInfo) {
        setError("会员计划信息错误");
        setIsProcessing(false);
        return;
      }
      const request: CreateOrderRequest = {
        amount: Math.round(amount * 100), // 转换为分
        productName: `${planInfo.name} - 月度会员`,
        productDesc: `每月 ${planInfo.sceneQuota} 次场景扩展 + ${planInfo.memeQuota} 次表情包制作`,
        paymentMethod: selectedMethod,
        userId: getUserId() || undefined,
        planId: selectedPlan,
        isFirstMonth: isFirstMonth,
      };

      const orderResponse = await createPaymentOrder(request);
      const { orderId, paymentParams } = orderResponse;

      console.log("[PaymentModal] 订单创建成功，订单ID:", orderId);

      // 调起支付
      if (selectedMethod === PaymentMethod.WECHAT) {
        try {
          const wechatParams = paymentParams as any;

          if (wechatParams.codeUrl) {
            // PC 端扫码支付
            setQrCodeUrl(wechatParams.codeUrl);
            setPaymentStatus("processing");

            // PC 端在弹窗内轮询，使用微信支付查询接口
            let pollCount = 0;
            const maxPollCount = 1800; // 最多轮询60分钟

            const startPolling = () => {
              // 立即执行第一次查询
              const checkOrderStatus = async () => {
                try {
                  pollCount++;
                  console.log(
                    `[PaymentModal] PC端轮询订单状态 (第 ${pollCount} 次): ${orderId}`
                  );

                  // 调用微信支付查询接口
                  const response = await fetch(
                    `/api/payment/wechat/query?orderId=${encodeURIComponent(
                      orderId
                    )}`
                  );
                  const result = await response.json();

                  if (result.success !== 1) {
                    console.error(
                      "[PaymentModal] 查询微信支付订单状态失败:",
                      result.message
                    );
                    if (pollCount >= maxPollCount) {
                      if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                      }
                      setPaymentStatus("failed");
                      setError("支付超时，请重新发起支付");
                      setIsProcessing(false);
                    }
                    return;
                  }

                  const wechatOrder = result.data;
                  const tradeState = wechatOrder.trade_state;
                  console.log(`[PaymentModal] PC端订单状态: ${tradeState}`);

                  if (tradeState === "SUCCESS") {
                    if (pollIntervalRef.current) {
                      clearInterval(pollIntervalRef.current);
                      pollIntervalRef.current = null;
                    }
                    setPaymentStatus("success");
                    setIsProcessing(false);
                    // 等待一小段时间，确保后端已处理支付通知并更新数据库，然后直接刷新页面
                    setTimeout(() => {
                      window.location.reload();
                    }, 1500);
                  } else if (
                    tradeState === "CLOSED" ||
                    tradeState === "REVOKED"
                  ) {
                    if (pollIntervalRef.current) {
                      clearInterval(pollIntervalRef.current);
                      pollIntervalRef.current = null;
                    }
                    setPaymentStatus("failed");
                    setError("订单已关闭或支付失败，请重新发起支付");
                    setIsProcessing(false);
                  } else if (pollCount >= maxPollCount) {
                    if (pollIntervalRef.current) {
                      clearInterval(pollIntervalRef.current);
                      pollIntervalRef.current = null;
                    }
                    setPaymentStatus("failed");
                    setError("支付超时，请重新发起支付");
                    setIsProcessing(false);
                  }
                } catch (err) {
                  console.error("[PaymentModal] PC端轮询订单状态错误:", err);
                  if (pollCount >= maxPollCount) {
                    if (pollIntervalRef.current) {
                      clearInterval(pollIntervalRef.current);
                      pollIntervalRef.current = null;
                    }
                    setPaymentStatus("failed");
                    setError("查询订单状态失败，请重试");
                    setIsProcessing(false);
                  }
                }
              };

              // 立即执行第一次查询
              checkOrderStatus();

              // 设置定时器，每2秒查询一次
              pollIntervalRef.current = setInterval(() => {
                checkOrderStatus();
              }, 2000);
            };

            // 开始轮询
            startPolling();
            return;
          }

          // 移动端 H5 支付
          await launchWechatPay(wechatParams);

          if (wechatParams.mwebUrl && typeof window !== "undefined") {
            // H5 支付会跳转到微信收银台，支付完成后会跳转回来
            // 跳转前开始轮询，以便支付完成后能检测到
            let pollCount = 0;
            const maxPollCount = 1800;

            const startPolling = () => {
              const checkOrderStatus = async () => {
                try {
                  pollCount++;
                  console.log(
                    `[PaymentModal] H5支付轮询订单状态 (第 ${pollCount} 次): ${orderId}`
                  );

                  const response = await fetch(
                    `/api/payment/wechat/query?orderId=${encodeURIComponent(
                      orderId
                    )}`
                  );
                  const result = await response.json();

                  if (result.success !== 1) {
                    if (pollCount >= maxPollCount) {
                      if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                      }
                    }
                    return;
                  }

                  const wechatOrder = result.data;
                  const tradeState = wechatOrder.trade_state;
                  console.log(`[PaymentModal] H5支付订单状态: ${tradeState}`);

                  if (tradeState === "SUCCESS") {
                    if (pollIntervalRef.current) {
                      clearInterval(pollIntervalRef.current);
                      pollIntervalRef.current = null;
                    }
                    setPaymentStatus("success");
                    setIsProcessing(false);
                    // 等待一小段时间，确保后端已处理支付通知并更新数据库，然后直接刷新页面
                    setTimeout(() => {
                      window.location.reload();
                    }, 1500);
                  } else if (
                    tradeState === "CLOSED" ||
                    tradeState === "REVOKED"
                  ) {
                    if (pollIntervalRef.current) {
                      clearInterval(pollIntervalRef.current);
                      pollIntervalRef.current = null;
                    }
                    setPaymentStatus("failed");
                    setError("订单已关闭或支付失败，请重新发起支付");
                    setIsProcessing(false);
                  } else if (pollCount >= maxPollCount) {
                    if (pollIntervalRef.current) {
                      clearInterval(pollIntervalRef.current);
                      pollIntervalRef.current = null;
                    }
                    setPaymentStatus("failed");
                    setError("支付超时，请重新发起支付");
                    setIsProcessing(false);
                  }
                } catch (err) {
                  console.error("[PaymentModal] H5支付轮询错误:", err);
                  if (pollCount >= maxPollCount) {
                    if (pollIntervalRef.current) {
                      clearInterval(pollIntervalRef.current);
                      pollIntervalRef.current = null;
                    }
                  }
                }
              };

              checkOrderStatus();
              pollIntervalRef.current = setInterval(() => {
                checkOrderStatus();
              }, 2000);
            };

            startPolling();
            window.location.href = wechatParams.mwebUrl;
            return;
          }
        } catch (wechatError: any) {
          throw wechatError;
        }
      } else if (selectedMethod === PaymentMethod.ALIPAY) {
        const alipayParams = paymentParams as any;
        await launchAlipay({
          paymentUrl: alipayParams.paymentUrl,
          orderString: alipayParams.orderString,
        });
        // 支付宝支付会跳转到支付宝收银台，支付完成后会跳转回来
        // 这里也可以添加轮询逻辑，但通常支付宝会通过回调通知
        return;
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setPaymentStatus("failed");
      setError(err.message || "支付失败，请重试");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-2 md:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl mx-2 md:mx-4 my-4 md:my-8 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-violet-600 to-violet-700 p-4 md:p-6 text-white flex-shrink-0">
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="absolute top-3 right-3 md:top-4 md:right-4 p-1.5 md:p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={18} className="md:w-5 md:h-5" />
          </button>
          <h2 className="text-xl md:text-2xl font-bold pr-10">选择会员计划</h2>
          {isFirstMonth && (
            <div className="mt-2 inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
              <Sparkles size={12} />
              首月享受 6 折优惠
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto flex-1">
          {/* 会员计划选择 */}
          {paymentStatus === "idle" && !selectedPlan && (
            <div>
              <MembershipPlans
                selectedPlan={selectedPlan || undefined}
                onSelectPlan={setSelectedPlan}
                isFirstMonth={isFirstMonth}
              />
            </div>
          )}

          {/* 已选择计划，显示支付方式 */}
          {paymentStatus === "idle" && selectedPlan && (
            <>
              {/* 选择的计划信息 */}
              <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-4 border-2 border-violet-200">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base md:text-lg text-gray-800 truncate">
                      {plan?.name}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
                      {plan?.description}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl md:text-2xl font-bold text-violet-600">
                      ¥{amount.toFixed(2)}
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-500">
                      /月
                    </div>
                    {isFirstMonth && plan && (
                      <div className="text-xs text-gray-400 line-through mt-1">
                        原价 ¥{plan.originalPrice}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 支付方式选择 */}
              <div className="space-y-2 md:space-y-3">
                <div className="text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  选择支付方式
                </div>

                {(() => {
                  const isWechat =
                    typeof window !== "undefined" &&
                    /micromessenger/i.test(navigator.userAgent);
                  return (
                    <button
                      onClick={() => setSelectedMethod(PaymentMethod.WECHAT)}
                      disabled={isProcessing}
                      className={`w-full p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all flex items-center gap-3 md:gap-4 ${
                        selectedMethod === PaymentMethod.WECHAT
                          ? "border-violet-500 bg-violet-50"
                          : "border-gray-200 hover:border-violet-200"
                      } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedMethod === PaymentMethod.WECHAT
                            ? "bg-violet-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Smartphone
                          size={20}
                          className={`md:w-6 md:h-6 ${
                            selectedMethod === PaymentMethod.WECHAT
                              ? "text-violet-600"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-semibold text-sm md:text-base text-gray-900 truncate">
                          微信支付
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500 truncate">
                          {isWechat ? "推荐使用" : "跳转微信收银台"}
                        </div>
                      </div>
                      {selectedMethod === PaymentMethod.WECHAT && (
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </button>
                  );
                })()}

                <button
                  onClick={() => setSelectedMethod(PaymentMethod.ALIPAY)}
                  disabled={isProcessing}
                  className={`w-full p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all flex items-center gap-3 md:gap-4 ${
                    selectedMethod === PaymentMethod.ALIPAY
                      ? "border-violet-500 bg-violet-50"
                      : "border-gray-200 hover:border-violet-200"
                  } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedMethod === PaymentMethod.ALIPAY
                        ? "bg-violet-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <CreditCard
                      size={20}
                      className={`md:w-6 md:h-6 ${
                        selectedMethod === PaymentMethod.ALIPAY
                          ? "text-violet-600"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-sm md:text-base text-gray-900 truncate">
                      支付宝
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-500 truncate">
                      安全便捷
                    </div>
                  </div>
                  {selectedMethod === PaymentMethod.ALIPAY && (
                    <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </button>
              </div>

              {/* 返回选择计划 */}
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                ← 返回选择计划
              </button>
            </>
          )}

          {/* Processing Status */}
          {paymentStatus === "processing" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              {qrCodeUrl ? (
                <>
                  <div className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl border-2 border-violet-200 shadow-lg">
                    <QRCodeSVG
                      value={qrCodeUrl}
                      size={isMobile ? 180 : 200}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <div className="font-semibold text-sm md:text-base text-gray-900 flex items-center justify-center gap-2">
                      <QrCode
                        size={18}
                        className="md:w-5 md:h-5 text-violet-600"
                      />
                      请使用微信扫码支付
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 px-4">
                      打开微信扫一扫，扫描上方二维码完成支付
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <Loader2 className="w-4 h-4 text-violet-600 animate-spin" />
                      <span className="text-xs text-gray-400">
                        等待支付中...
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      正在处理支付...
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      请完成支付操作
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Success Status */}
          {paymentStatus === "success" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <div className="text-center">
                <div className="font-semibold text-gray-900 text-lg">
                  支付成功！
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  正在为您升级会员...
                </div>
              </div>
            </div>
          )}

          {/* Failed Status */}
          {paymentStatus === "failed" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <XCircle className="w-16 h-16 text-red-500" />
              <div className="text-center">
                <div className="font-semibold text-gray-900 text-lg">
                  支付失败
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {error || "请重试"}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && paymentStatus === "idle" && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          {paymentStatus === "idle" && selectedPlan && (
            <button
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing || featureDisabled}
              className={`w-full py-3 md:py-4 rounded-lg md:rounded-xl font-semibold text-sm md:text-base text-white transition-all flex items-center justify-center gap-2 ${
                !selectedMethod || isProcessing || featureDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-violet-600 hover:bg-violet-700 active:scale-95"
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 md:w-[18px] md:h-[18px]" />
                  处理中...
                </>
              ) : featureDisabled ? (
                <>
                  <CreditCard size={16} className="md:w-[18px] md:h-[18px]" />
                  待开放
                </>
              ) : (
                <>
                  <CreditCard size={16} className="md:w-[18px] md:h-[18px]" />
                  确认支付 ¥{amount.toFixed(2)}
                </>
              )}
            </button>
          )}

          {paymentStatus === "failed" && (
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setPaymentStatus("idle");
                  setError(null);
                }}
                className="flex-1 py-3 rounded-xl font-semibold bg-violet-600 text-white hover:bg-violet-700"
              >
                重试
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
