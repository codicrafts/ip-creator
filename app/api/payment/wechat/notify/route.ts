import { NextRequest, NextResponse } from "next/server";
import { getCloudDB } from "@/lib/db";
import crypto from "crypto";

/**
 * 微信支付异步通知回调接口
 * POST /api/payment/wechat/notify
 *
 * 参考文档：https://pay.weixin.qq.com/docs/merchant/apis/jsapi-payment/payment-result.html
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体（微信支付 V3 API 使用 JSON 格式）
    const body = await request.json();

    console.log("微信支付异步通知参数:", JSON.stringify(body, null, 2));

    // 验证签名
    const WECHAT_PUBLIC_KEY = process.env.WECHAT_PUBLIC_KEY || "";

    if (!WECHAT_PUBLIC_KEY) {
      console.error("微信支付公钥未配置");
      return NextResponse.json(
        { code: "FAIL", message: "配置错误" },
        { status: 500 }
      );
    }

    // 获取请求头中的签名信息
    const signature = request.headers.get("Wechatpay-Signature");
    const timestamp = request.headers.get("Wechatpay-Timestamp");
    const nonce = request.headers.get("Wechatpay-Nonce");
    const serial = request.headers.get("Wechatpay-Serial");

    if (!signature || !timestamp || !nonce || !serial) {
      console.error("微信支付签名头信息不完整");
      return NextResponse.json(
        { code: "FAIL", message: "签名验证失败" },
        { status: 400 }
      );
    }

    // 验证签名（简化版，实际应该使用微信支付 V3 API 的验签方法）
    // 注意：这里需要根据微信支付 V3 API 的验签规则进行验证
    // 参考：https://pay.weixin.qq.com/docs/merchant/development/interface-rules/signature-generation.html

    // 获取订单号
    const outTradeNo = body.out_trade_no || body.resource?.out_trade_no;
    if (!outTradeNo) {
      console.error("订单号不存在");
      return NextResponse.json(
        { code: "FAIL", message: "订单号不存在" },
        { status: 400 }
      );
    }

    // 获取交易状态
    const tradeState = body.trade_state || body.resource?.trade_state;
    const transactionId = body.transaction_id || body.resource?.transaction_id; // 微信支付订单号

    console.log(
      `订单 ${outTradeNo} 交易状态: ${tradeState}, 微信支付订单号: ${transactionId}`
    );

    // 获取数据库实例
    const { db } = await getCloudDB();

    // 查询订单
    const orderResult = await db
      .collection("orders")
      .where({ orderId: outTradeNo })
      .get();

    if (orderResult.data.length === 0) {
      console.error(`订单不存在: ${outTradeNo}`);
      return NextResponse.json(
        { code: "FAIL", message: "订单不存在" },
        { status: 404 }
      );
    }

    const order = orderResult.data[0];

    // 处理不同的交易状态
    // 参考：https://pay.weixin.qq.com/docs/merchant/apis/jsapi-payment/payment-result.html
    if (tradeState === "SUCCESS") {
      // 交易成功

      // 检查订单是否已经处理过（防止重复通知）
      if (order.status === "SUCCESS") {
        console.log(`订单 ${outTradeNo} 已经处理过，忽略重复通知`);
        return NextResponse.json({ code: "SUCCESS", message: "处理成功" });
      }

      // 更新订单状态
      await db
        .collection("orders")
        .where({ orderId: outTradeNo })
        .update({
          data: {
            status: "SUCCESS",
            paidAt: Date.now(),
            wechatTransactionId: transactionId, // 保存微信支付订单号
          },
        });

      // 更新用户会员状态和到期时间
      const planId = order.planId || "STANDARD"; // 默认标准会员
      const paidAt = Date.now();
      const membershipExpiresAt = paidAt + 30 * 24 * 60 * 60 * 1000; // 30天后

      // 计算当前月份（用于重置使用次数）
      const currentDate = new Date(paidAt);
      const currentMonth = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}`;

      await db
        .collection("users")
        .doc(order.userId)
        .update({
          data: {
            userTier: planId,
            membershipExpiresAt: membershipExpiresAt,
            membershipStartedAt: paidAt,
            // 重置使用次数为当月
            sceneUsage: { date: currentMonth, count: 0 },
            memeUsage: { date: currentMonth, count: 0 },
          },
        });

      console.log(
        `订单 ${outTradeNo} 支付成功，已更新订单和用户状态（会员计划: ${planId}）`
      );
    } else if (tradeState === "CLOSED" || tradeState === "REVOKED") {
      // 交易关闭或已撤销
      await db
        .collection("orders")
        .where({ orderId: outTradeNo })
        .update({
          data: {
            status: "CANCELLED",
          },
        });

      console.log(`订单 ${outTradeNo} 已关闭或撤销`);
    } else {
      // 其他状态（如 NOTPAY 未支付、USERPAYING 用户支付中）
      console.log(`订单 ${outTradeNo} 状态: ${tradeState}，暂不处理`);
    }

    // 返回成功响应（必须返回成功，否则微信会重复通知）
    return NextResponse.json({ code: "SUCCESS", message: "处理成功" });
  } catch (error: any) {
    console.error("处理微信支付异步通知失败:", error);
    return NextResponse.json(
      { code: "FAIL", message: error.message || "处理失败" },
      { status: 500 }
    );
  }
}
