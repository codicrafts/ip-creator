"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import {
  setUserTier,
  setSceneUsage,
  setMemeUsage,
  setMembershipExpiresAt,
} from "@/store/slices/userSlice";
import { queryOrderStatus } from "@/services/paymentService";
import { getUserInfo } from "@/services/userService";
import { UserTier } from "@/types";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState("正在查询订单状态...");

  useEffect(() => {
    const checkOrder = async () => {
      try {
        // 从 URL 参数或 sessionStorage 获取订单ID
        const orderIdFromUrl = searchParams.get("orderId");
        const orderIdFromStorage = sessionStorage.getItem(
          "pending_payment_order_id"
        );
        const orderId = orderIdFromUrl || orderIdFromStorage;

        if (!orderId) {
          setStatus("failed");
          setMessage("未找到订单信息");
          setTimeout(() => {
            router.push("/profile");
          }, 2000);
          return;
        }

        // 清除 sessionStorage
        if (orderIdFromStorage) {
          sessionStorage.removeItem("pending_payment_order_id");
        }

        // 查询订单状态
        const order = await queryOrderStatus(orderId);

        if (order.status === "SUCCESS") {
          setStatus("success");
          setMessage("支付成功！会员状态已更新");

          // 从订单中获取会员计划并更新 Redux
          const planId = (order as any).planId || UserTier.STANDARD;
          dispatch(setUserTier(planId as UserTier));

          // 刷新用户信息（包括使用次数等）
          try {
            const userInfo = await getUserInfo();
            dispatch(setUserTier(userInfo.userTier));
            dispatch(setSceneUsage(userInfo.sceneUsage));
            dispatch(setMemeUsage(userInfo.memeUsage));
            if (userInfo.membershipExpiresAt !== undefined) {
              dispatch(setMembershipExpiresAt(userInfo.membershipExpiresAt));
            }
          } catch (err) {
            console.error("刷新用户信息失败:", err);
          }

          // 3秒后跳转到个人资料页面，添加 refresh 参数以触发刷新
          setTimeout(() => {
            router.push("/profile?refresh=true");
          }, 3000);
        } else if (order.status === "PENDING") {
          // 订单还在处理中，继续轮询
          let pollCount = 0;
          const maxPollCount = 30; // 最多轮询30次（60秒）

          const pollInterval = setInterval(async () => {
            try {
              pollCount++;
              const updatedOrder = await queryOrderStatus(orderId);

              if (updatedOrder.status === "SUCCESS") {
                clearInterval(pollInterval);
                setStatus("success");
                setMessage("支付成功！会员状态已更新");

                // 更新 Redux 状态
                const planId =
                  (updatedOrder as any).planId || UserTier.STANDARD;
                dispatch(setUserTier(planId as UserTier));

                // 刷新用户信息（包括使用次数等）
                try {
                  const userInfo = await getUserInfo();
                  dispatch(setUserTier(userInfo.userTier));
                  dispatch(setSceneUsage(userInfo.sceneUsage));
                  dispatch(setMemeUsage(userInfo.memeUsage));
                } catch (err) {
                  console.error("刷新用户信息失败:", err);
                }

                setTimeout(() => {
                  router.push("/profile");
                }, 3000);
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
              console.error("轮询订单状态失败:", err);
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
        console.error("查询订单状态失败:", error);
        setStatus("failed");
        setMessage("查询订单状态失败，请稍后查看");
        setTimeout(() => {
          router.push("/profile");
        }, 3000);
      }
    };

    checkOrder();
  }, [searchParams, router, dispatch]);

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
