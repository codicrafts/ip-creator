import {
  PaymentMethod,
  CreateOrderRequest,
  CreateOrderResponse,
  PaymentOrder,
} from "../types";
import { callCloudFunction } from "@/lib/cloud";
import { getUserId } from "@/lib/cookies";

/**
 * 创建支付订单（使用云函数）
 * @param request 订单请求参数
 * @returns 支付参数（用于调起支付）
 */
export const createPaymentOrder = async (
  request: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  try {
    // 获取用户ID（如果请求中没有提供）
    const userId = request.userId || getUserId();

    if (!userId) {
      throw new Error("用户未登录");
    }

    // 获取当前页面的 URL，用于支付完成后跳转
    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/payment-success`
        : "https://your-domain.com/payment-success";

    // 检测设备类型：PC 或移动端
    const deviceType =
      typeof window !== "undefined"
        ? window.innerWidth >= 768
          ? "pc"
          : "mobile" // 简单判断：宽度 >= 768px 为 PC
        : "mobile";

    const result = await callCloudFunction("payment", {
      action: "create",
      userId: userId,
      amount: request.amount,
      productName: request.productName,
      productDesc: request.productDesc,
      paymentMethod: request.paymentMethod,
      redirectUrl: redirectUrl, // 支付完成后跳转的地址
      deviceType: deviceType, // 设备类型：'pc' 或 'mobile'
      planId: request.planId, // 会员计划ID（BASIC, STANDARD, PREMIUM）
      isFirstMonth: request.isFirstMonth, // 是否首月（享受6折优惠）
    });

    if (result.success !== 1) {
      throw new Error(result.message || "创建订单失败");
    }

    const data = result.data as {
      orderId: string;
      paymentParams: any;
    };

    return {
      orderId: data.orderId,
      paymentParams: data.paymentParams,
    };
  } catch (error: any) {
    console.error("Create payment order error:", error);
    throw error;
  }
};

/**
 * 查询订单状态（使用云函数）
 * @param orderId 订单ID
 * @returns 订单信息
 */
export const queryOrderStatus = async (
  orderId: string
): Promise<PaymentOrder> => {
  try {
    const result = await callCloudFunction("payment", {
      action: "query",
      orderId: orderId,
    });

    if (result.success !== 1) {
      throw new Error(result.message || "查询订单失败");
    }

    const orderData = result.data as {
      orderId: string;
      amount: number;
      productName: string;
      productDesc?: string;
      paymentMethod: string;
      status: string;
      createdAt: number;
      paidAt?: number;
    };
    return {
      orderId: orderData.orderId,
      amount: orderData.amount,
      productName: orderData.productName,
      productDesc: orderData.productDesc,
      paymentMethod: orderData.paymentMethod as PaymentMethod,
      status: orderData.status as any,
      createdAt: orderData.createdAt,
      paidAt: orderData.paidAt || undefined,
    };
  } catch (error: any) {
    console.error("Query order status error:", error);
    throw error;
  }
};

/**
 * 调起微信支付
 * @param params 微信支付参数（可能包含 mwebUrl、codeUrl 等）
 * @returns Promise<void>
 */
export const launchWechatPay = (params: {
  appId?: string;
  timeStamp?: string;
  nonceStr?: string;
  package?: string;
  signType?: string;
  paySign?: string;
  mwebUrl?: string; // H5 支付地址，用于移动端非微信环境
  codeUrl?: string; // Native 支付二维码地址，用于 PC 端
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 检查是否在浏览器环境
    if (typeof window === "undefined") {
      reject(new Error("请在浏览器中打开"));
      return;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isWechat = /micromessenger/.test(userAgent);

    // 如果在微信环境，优先使用 JSAPI 支付
    if (isWechat) {
      // 优先使用 WeixinJSBridge（微信内置浏览器）
      // 根据微信支付文档：https://pay.weixin.qq.com/doc/v3/merchant/4012791857
      if ((window as any).WeixinJSBridge && params.appId && params.package) {
        // 注意：微信支付 V3 API 使用 RSA 签名，但 V2 API 的 JSAPI 调起支付可能使用 MD5
        // 这里根据后端返回的 signType 使用对应的签名方式
        (window as any).WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            appId: params.appId,
            timeStamp: params.timeStamp,
            nonceStr: params.nonceStr,
            package: params.package,
            signType: params.signType || "MD5", // 默认使用 MD5（V2 API）
            paySign: params.paySign,
          },
          (res: any) => {
            if (res.err_msg === "get_brand_wcpay_request:ok") {
              resolve();
            } else {
              reject(new Error(res.err_msg || "支付失败"));
            }
          }
        );
        return;
      }

      // 尝试使用微信 JSSDK
      if (
        (window as any).wx &&
        (window as any).wx.chooseWXPay &&
        params.appId &&
        params.package
      ) {
        (window as any).wx.chooseWXPay({
          timestamp: params.timeStamp,
          nonceStr: params.nonceStr,
          package: params.package,
          signType: params.signType,
          paySign: params.paySign,
          success: () => {
            resolve();
          },
          fail: (err: any) => {
            reject(new Error(err.errMsg || "支付失败"));
          },
        });
        return;
      }
    }

    // 非微信环境或微信环境但 JSAPI 不可用，使用 H5 支付（mwebUrl）
    if (params.mwebUrl) {
      // 跳转到微信收银台
      window.location.href = params.mwebUrl;
      // 注意：跳转后无法直接监听结果，需要通过轮询订单状态确认
      // 这里先 resolve，让轮询逻辑处理
      resolve();
      return;
    }

    // 如果既没有 JSAPI 参数也没有 mwebUrl，报错
    if (!params.appId || !params.package) {
      reject(new Error("支付参数不完整，请重试"));
      return;
    }

    // 在微信中但没有支付接口，可能是 JSSDK 未初始化
    reject(new Error("微信支付接口未就绪，请稍后重试或刷新页面"));
  });
};

/**
 * 调起支付宝支付
 * @param params 支付宝支付参数（可能包含 paymentUrl 或 orderString）
 * @returns Promise<void>
 */
export const launchAlipay = (params: {
  paymentUrl?: string; // 支付页面链接（PC端使用，推荐）
  orderString?: string; // 订单字符串（旧版，已废弃）
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 优先使用 paymentUrl（PC端支付页面链接）
    if (params.paymentUrl) {
      // 直接跳转到支付页面
      window.location.href = params.paymentUrl;
      // 注意：支付宝支付后会在新窗口打开，无法直接监听结果
      // 需要通过轮询订单状态来确认支付结果
      resolve();
      return;
    }

    // 兼容旧版 orderString（已废弃）
    if (params.orderString) {
      // 创建隐藏的表单并提交
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://openapi.alipay.com/gateway.do";
      form.style.display = "none";

      // 解析 orderString 并创建表单字段
      // orderString 格式通常是：app_id=xxx&biz_content=xxx&charset=xxx&...
      const urlParams = new URLSearchParams(params.orderString);
      urlParams.forEach((value, key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      // 注意：支付宝支付后会在新窗口打开，无法直接监听结果
      // 需要通过轮询订单状态来确认支付结果
      resolve();
      return;
    }

    reject(new Error("支付宝支付参数不完整"));
  });
};

/**
 * 轮询订单状态直到支付完成或超时
 * @param orderId 订单ID
 * @param maxAttempts 最大尝试次数
 * @param interval 轮询间隔（毫秒）
 * @returns 订单状态
 */
export const pollOrderStatus = async (
  orderId: string,
  maxAttempts = 30,
  interval = 2000
): Promise<PaymentOrder> => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const order = await queryOrderStatus(orderId);
      if (
        order.status === "SUCCESS" ||
        order.status === "FAILED" ||
        order.status === "CANCELLED"
      ) {
        return order;
      }
      // 等待后继续轮询
      await new Promise((resolve) => setTimeout(resolve, interval));
    } catch (error) {
      console.error(`Poll attempt ${i + 1} failed:`, error);
      if (i === maxAttempts - 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
  throw new Error("支付超时，请稍后查询订单状态");
};
