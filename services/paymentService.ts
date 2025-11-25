import { PaymentMethod, CreateOrderRequest, CreateOrderResponse, PaymentOrder } from '../types';

// 配置：后端 API 地址
// 请根据实际情况修改为你的后端 API 地址
// Next.js 环境变量需要以 NEXT_PUBLIC_ 开头才能在客户端访问
const PAYMENT_API_BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_API_URL || 'https://your-api-domain.com/api/payment';

/**
 * 创建支付订单
 * @param request 订单请求参数
 * @returns 支付参数（用于调起支付）
 */
export const createPaymentOrder = async (
  request: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  try {
    const response = await fetch(`${PAYMENT_API_BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '创建订单失败');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create payment order error:', error);
    throw error;
  }
};

/**
 * 查询订单状态
 * @param orderId 订单ID
 * @returns 订单信息
 */
export const queryOrderStatus = async (orderId: string): Promise<PaymentOrder> => {
  try {
    const response = await fetch(`${PAYMENT_API_BASE_URL}/query/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('查询订单失败');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Query order status error:', error);
    throw error;
  }
};

/**
 * 调起微信支付
 * @param params 微信支付参数
 * @returns Promise<void>
 */
export const launchWechatPay = (params: {
  appId: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 检查是否在微信环境
    if (typeof window === 'undefined' || !(window as any).WeixinJSBridge) {
      // 如果不在微信环境，尝试使用 JSSDK
      if ((window as any).wx) {
        // 使用微信 JSSDK 调起支付
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
            reject(new Error(err.errMsg || '支付失败'));
          },
        });
      } else {
        reject(new Error('请在微信中打开'));
      }
      return;
    }

    // 使用 WeixinJSBridge 调起支付
    (window as any).WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      {
        appId: params.appId,
        timeStamp: params.timeStamp,
        nonceStr: params.nonceStr,
        package: params.package,
        signType: params.signType,
        paySign: params.paySign,
      },
      (res: any) => {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          resolve();
        } else {
          reject(new Error(res.err_msg || '支付失败'));
        }
      }
    );
  });
};

/**
 * 调起支付宝支付
 * @param orderString 支付宝订单字符串
 * @returns Promise<void>
 */
export const launchAlipay = (orderString: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 创建隐藏的表单并提交
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://openapi.alipay.com/gateway.do';
    form.style.display = 'none';

    // 解析 orderString 并创建表单字段
    // orderString 格式通常是：app_id=xxx&biz_content=xxx&charset=xxx&...
    const params = new URLSearchParams(orderString);
    params.forEach((value, key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    // 注意：支付宝支付后会在新窗口打开，无法直接监听结果
    // 需要通过轮询订单状态来确认支付结果
    resolve();
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
      if (order.status === 'SUCCESS' || order.status === 'FAILED' || order.status === 'CANCELLED') {
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
  throw new Error('支付超时，请稍后查询订单状态');
};

