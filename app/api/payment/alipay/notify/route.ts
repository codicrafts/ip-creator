import { NextRequest, NextResponse } from "next/server";
import { getCloudDB } from "@/lib/db";
import { AlipaySdk } from "alipay-sdk";
import crypto from "crypto";

/**
 * 支付宝异步通知回调接口
 * POST /api/payment/alipay/notify
 *
 * 参考文档：https://opendocs.alipay.com/open/021nju#异步通知
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体（支付宝使用 application/x-www-form-urlencoded 格式）
    const formData = await request.formData();
    const params: Record<string, string> = {};

    // 将 FormData 转换为对象
    for (const [key, value] of formData.entries()) {
      params[key] = value.toString();
    }

    // 如果 FormData 为空，尝试从 URL 查询参数获取（某些情况下支付宝可能使用 GET）
    if (Object.keys(params).length === 0) {
      const url = new URL(request.url);
      for (const [key, value] of url.searchParams.entries()) {
        params[key] = value;
      }
    }

    console.log("支付宝异步通知参数:", params);

    // 验证签名
    const ALIPAY_PUBLIC_KEY = process.env.ALIPAY_PUBLIC_KEY || "";
    const ALIPAY_SIGN_TYPE = process.env.ALIPAY_SIGN_TYPE || "RSA2";

    if (!ALIPAY_PUBLIC_KEY) {
      console.error("支付宝公钥未配置");
      return new NextResponse("FAIL", { status: 500 });
    }

    // 验签
    const isValid = verifyAlipaySign(
      params,
      ALIPAY_PUBLIC_KEY,
      ALIPAY_SIGN_TYPE
    );

    if (!isValid) {
      console.error("支付宝签名验证失败");
      return new NextResponse("FAIL", { status: 400 });
    }

    // 获取订单号
    const outTradeNo = params.out_trade_no;
    if (!outTradeNo) {
      console.error("订单号不存在");
      return new NextResponse("FAIL", { status: 400 });
    }

    // 获取交易状态
    const tradeStatus = params.trade_status;
    const tradeNo = params.trade_no; // 支付宝交易号

    console.log(
      `订单 ${outTradeNo} 交易状态: ${tradeStatus}, 支付宝交易号: ${tradeNo}`
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
      return new NextResponse("FAIL", { status: 404 });
    }

    const order = orderResult.data[0];

    // 处理不同的交易状态
    // 参考：https://opendocs.alipay.com/open/021nju#交易状态说明
    if (tradeStatus === "TRADE_SUCCESS" || tradeStatus === "TRADE_FINISHED") {
      // 交易成功或交易结束
      // 注意：TRADE_FINISHED 表示交易结束，不可退款；TRADE_SUCCESS 表示交易成功，可退款

      // 检查订单是否已经处理过（防止重复通知）
      if (order.status === "SUCCESS") {
        console.log(`订单 ${outTradeNo} 已经处理过，忽略重复通知`);
        return new NextResponse("SUCCESS");
      }

      // 更新订单状态
      await db
        .collection("orders")
        .where({ orderId: outTradeNo })
        .update({
          data: {
            status: "SUCCESS",
            paidAt: Date.now(),
            alipayTradeNo: tradeNo, // 保存支付宝交易号
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
    } else if (tradeStatus === "TRADE_CLOSED") {
      // 交易关闭
      await db
        .collection("orders")
        .where({ orderId: outTradeNo })
        .update({
          data: {
            status: "CANCELLED",
          },
        });

      console.log(`订单 ${outTradeNo} 已关闭`);
    } else {
      // 其他状态（如 WAIT_BUYER_PAY 等待买家付款）
      console.log(`订单 ${outTradeNo} 状态: ${tradeStatus}，暂不处理`);
    }

    // 返回成功响应（必须返回 "SUCCESS"，否则支付宝会重复通知）
    return new NextResponse("SUCCESS");
  } catch (error: any) {
    console.error("处理支付宝异步通知失败:", error);
    return new NextResponse("FAIL", { status: 500 });
  }
}

/**
 * 验证支付宝签名
 * @param params 支付宝返回的参数
 * @param alipayPublicKey 支付宝公钥
 * @param signType 签名类型（RSA 或 RSA2）
 * @returns 是否验证通过
 */
function verifyAlipaySign(
  params: Record<string, string>,
  alipayPublicKey: string,
  signType: string
): boolean {
  try {
    // 获取签名
    const sign = params.sign;
    if (!sign) {
      console.error("签名不存在");
      return false;
    }

    // 获取签名类型
    const signTypeFromParams = params.sign_type || signType;

    // 构建待签名字符串
    // 排除 sign 和 sign_type 参数，按照参数名 ASCII 码从小到大排序
    const sortedParams: Record<string, string> = {};
    for (const key in params) {
      if (key !== "sign" && key !== "sign_type" && params[key]) {
        sortedParams[key] = params[key];
      }
    }

    // 按照参数名 ASCII 码从小到大排序
    const sortedKeys = Object.keys(sortedParams).sort();
    const signContent = sortedKeys
      .map((key) => `${key}=${sortedParams[key]}`)
      .join("&");

    // 处理公钥格式
    let publicKey = alipayPublicKey.replace(/\\n/g, "\n");
    if (!publicKey.includes("BEGIN PUBLIC KEY")) {
      // 如果没有 BEGIN/END 标记，添加它们
      publicKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
    }

    // 验证签名
    const verify = crypto.createVerify(
      signTypeFromParams === "RSA2" ? "RSA-SHA256" : "RSA-SHA1"
    );
    verify.update(signContent, "utf8");

    const isValid = verify.verify(publicKey, sign, "base64");
    return isValid;
  } catch (error: any) {
    console.error("验证支付宝签名失败:", error);
    return false;
  }
}
