"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setUserTier,
  setSceneUsage,
  setMemeUsage,
  setMembershipExpiresAt,
} from "@/store/slices/userSlice";
import { getUserInfo } from "@/services/userService";
import { UserTier } from "@/types";

/**
 * 调用支付宝 trade.query API 查询订单状态
 * @param orderId 商户订单号 (out_trade_no，可选)
 * @param tradeNo 支付宝交易号 (trade_no，可选，优先使用)
 */
async function queryAlipayOrder(orderId?: string, tradeNo?: string) {
  try {
    const requestBody: any = {};

    // 优先使用 trade_no（支付宝交易号），如果不存在则使用 orderId（商户订单号）
    if (tradeNo) {
      requestBody.tradeNo = tradeNo;
    } else if (orderId) {
      requestBody.orderId = orderId;
    } else {
      throw new Error("订单ID或支付宝交易号不能为空");
    }

    const response = await fetch("/api/payment/alipay/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "查询支付宝订单失败");
    }

    // 将支付宝查询结果转换为统一的订单格式
    return {
      orderId: result.data.orderId,
      status: result.data.orderStatus,
      tradeStatus: result.data.tradeStatus,
      tradeNo: result.data.tradeNo,
      amount: result.data.totalAmount,
      paidAt: result.data.sendPayDate
        ? new Date(result.data.sendPayDate).getTime()
        : undefined,
    };
  } catch (error: any) {
    throw error;
  }
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.userId);
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState("正在查询订单状态...");

  useEffect(() => {
    const checkOrder = async () => {
      try {
        // 从 URL 参数中提取支付宝返回的参数
        const outTradeNo = searchParams.get("out_trade_no");
        const tradeNo = searchParams.get("trade_no");
        const orderIdFromUrl = searchParams.get("orderId");
        const orderIdFromStorage = sessionStorage.getItem(
          "pending_payment_order_id"
        );

        const orderId = outTradeNo || orderIdFromUrl || orderIdFromStorage;

        if (!orderId) {
          setStatus("failed");
          setMessage("未找到订单信息");
          setTimeout(() => {
            router.push("/profile");
          }, 2000);
          return;
        }

        if (orderIdFromStorage) {
          sessionStorage.removeItem("pending_payment_order_id");
        }

        const order = await queryAlipayOrder(
          tradeNo ? undefined : orderId,
          tradeNo || undefined
        );

        if (order.status === "SUCCESS") {
          setStatus("success");
          setMessage("支付成功！");

          try {
            if (userId) {
              const userInfo = await getUserInfo(userId);
              dispatch(setUserTier(userInfo.userTier));
              dispatch(setSceneUsage(userInfo.sceneUsage));
              dispatch(setMemeUsage(userInfo.memeUsage));
              if (userInfo.membershipExpiresAt !== undefined) {
                dispatch(setMembershipExpiresAt(userInfo.membershipExpiresAt));
              }
            }
          } catch (err) {
            // 忽略刷新用户信息失败
          }

          setTimeout(() => {
            router.push("/profile?refresh=true");
          }, 1500);
          return;
        } else if (order.status === "PENDING") {
          let pollCount = 0;
          const maxPollCount = 30;

          const pollInterval = setInterval(async () => {
            try {
              pollCount++;
              const updatedOrder = await queryAlipayOrder(
                tradeNo ? undefined : orderId,
                tradeNo || undefined
              );

              if (updatedOrder.status === "SUCCESS") {
                clearInterval(pollInterval);
                setStatus("success");
                setMessage("支付成功！");

                try {
                  if (userId) {
                    const userInfo = await getUserInfo(userId);
                    dispatch(setUserTier(userInfo.userTier));
                    dispatch(setSceneUsage(userInfo.sceneUsage));
                    dispatch(setMemeUsage(userInfo.memeUsage));
                    if (userInfo.membershipExpiresAt !== undefined) {
                      dispatch(
                        setMembershipExpiresAt(userInfo.membershipExpiresAt)
                      );
                    }
                  }
                } catch (err) {
                  console.error("刷新用户信息失败:", err);
                }

                setTimeout(() => {
                  router.push("/profile?refresh=true");
                }, 1500);
                return;
              } else if (
                updatedOrder.status === "FAILED" ||
                updatedOrder.status === "CANCELLED"
              ) {
                clearInterval(pollInterval);
                setStatus("failed");
                setMessage("支付失败或已取消");
                setTimeout(() => {
                  router.push("/profile");
                }, 3000);
              } else if (pollCount >= maxPollCount) {
                clearInterval(pollInterval);
                setStatus("failed");
                setMessage("查询超时，请稍后查看订单状态");
                setTimeout(() => {
                  router.push("/profile");
                }, 3000);
              }
            } catch (err) {
              if (pollCount >= maxPollCount) {
                clearInterval(pollInterval);
                setStatus("failed");
                setMessage("查询订单状态失败");
                setTimeout(() => {
                  router.push("/profile");
                }, 3000);
              }
            }
          }, 2000);
        } else {
          setStatus("failed");
          setMessage("支付失败或已取消");
          setTimeout(() => {
            router.push("/profile?refresh=true");
          }, 3000);
        }
      } catch (error: any) {
        const errorMessage = error.message || "查询订单状态失败，请稍后查看";
        setStatus("failed");
        setMessage(errorMessage);
        setTimeout(() => {
          router.push("/profile");
        }, 3000);
      }
    };

    checkOrder();
  }, [searchParams, router, dispatch, userId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-lg max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="animate-spin text-violet-600" size={48} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">处理中...</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-500" size={48} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">支付成功！</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">正在跳转到个人中心...</p>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="flex justify-center mb-4">
              <XCircle className="text-red-500" size={48} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">支付失败</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">正在返回个人中心...</p>
          </>
        )}
      </div>
    </div>
  );
}
