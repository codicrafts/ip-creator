import { NextRequest, NextResponse } from "next/server";
import https from "https";
import crypto from "crypto";
import { getCloudDB } from "@/lib/db";

/**
 * 生成随机字符串
 */
function generateNonceStr(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 规范化私钥格式
 * @param privateKey - 原始私钥字符串
 * @returns 规范化后的私钥
 */
function normalizePrivateKey(privateKey: string): string {
  if (!privateKey) {
    throw new Error("私钥不能为空");
  }

  // 替换环境变量中的 \n 为实际换行符
  let normalized = privateKey.replace(/\\n/g, "\n");

  // 确保私钥包含正确的 BEGIN 和 END 标记
  if (
    !normalized.includes("BEGIN PRIVATE KEY") &&
    !normalized.includes("BEGIN RSA PRIVATE KEY")
  ) {
    throw new Error("私钥格式不正确：缺少 BEGIN 标记");
  }

  if (
    !normalized.includes("END PRIVATE KEY") &&
    !normalized.includes("END RSA PRIVATE KEY")
  ) {
    throw new Error("私钥格式不正确：缺少 END 标记");
  }

  // 如果是 RSA PRIVATE KEY 格式，尝试转换为 PRIVATE KEY 格式
  if (normalized.includes("BEGIN RSA PRIVATE KEY")) {
    try {
      // 尝试直接使用，如果失败则转换
      const key = crypto.createPrivateKey(normalized);
      // 如果成功，导出为 PKCS#8 格式
      normalized = key.export({
        type: "pkcs8",
        format: "pem",
      }) as string;
    } catch (err) {
      // 如果转换失败，使用原始格式
      console.warn("私钥格式转换失败，使用原始格式:", err);
    }
  }

  return normalized;
}

/**
 * 生成微信支付 V3 API 签名
 */
function generateWechatV3Sign(
  method: string,
  url: string,
  timestamp: string,
  nonceStr: string,
  body: string,
  privateKey: string
): string {
  try {
    // 规范化私钥格式
    const normalizedKey = normalizePrivateKey(privateKey);

    // 构建签名串：请求方法\nURL\n时间戳\n随机字符串\n请求体\n
    const signStr = `${method}\n${url}\n${timestamp}\n${nonceStr}\n${body}\n`;

    // 使用 RSA-SHA256 签名
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(signStr, "utf8");
    const signature = sign.sign(normalizedKey, "base64");

    return signature;
  } catch (error: any) {
    console.error("签名生成失败:", error.message);
    throw new Error(`签名生成失败: ${error.message}`);
  }
}

/**
 * 生成微信支付 V3 API Authorization header
 */
function generateWechatV3Auth(
  mchId: string,
  serialNo: string,
  nonceStr: string,
  timestamp: string,
  signature: string
): string {
  return `WECHATPAY2-SHA256-RSA2048 mchid="${mchId}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${serialNo}"`;
}

/**
 * 通过商户订单号查询微信支付订单状态
 * GET /api/payment/wechat/query?orderId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        {
          success: 0,
          message: "订单ID不能为空",
        },
        { status: 400 }
      );
    }

    // 获取微信支付配置
    const WECHAT_MCH_ID = process.env.WECHAT_MCH_ID || "1730633244";
    const WECHAT_PRIVATE_KEY = process.env.WECHAT_PRIVATE_KEY || "";
    const WECHAT_SERIAL_NO = process.env.WECHAT_SERIAL_NO || "";

    if (!WECHAT_PRIVATE_KEY || !WECHAT_SERIAL_NO) {
      return NextResponse.json(
        {
          success: 0,
          message: "微信支付配置不完整",
        },
        { status: 500 }
      );
    }

    // 调用微信支付接口查询订单状态
    const baseUrl = `/v3/pay/transactions/out-trade-no/${orderId}`;
    const queryParams = `mchid=${WECHAT_MCH_ID}`;
    const url = `${baseUrl}?${queryParams}`;
    const method = "GET";
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = generateNonceStr(32);
    const body = ""; // GET 请求没有 body

    // 生成签名
    const signature = generateWechatV3Sign(
      method,
      url,
      timestamp,
      nonceStr,
      body,
      WECHAT_PRIVATE_KEY
    );

    // 生成 Authorization header
    const authorization = generateWechatV3Auth(
      WECHAT_MCH_ID,
      WECHAT_SERIAL_NO,
      nonceStr,
      timestamp,
      signature
    );

    // 调用微信支付接口（带超时）
    const result = await new Promise<any>((resolve, reject) => {
      const options = {
        hostname: "api.mch.weixin.qq.com",
        port: 443,
        path: url,
        method: method,
        headers: {
          Authorization: authorization,
          Accept: "application/json",
          "User-Agent": "WeChatPay-APIv3-NodeJS",
        },
        timeout: 180000, // 3 分钟超时
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            if (res.statusCode === 200) {
              resolve(result);
            } else {
              reject(
                new Error(
                  result.message || result.code || "微信支付接口调用失败"
                )
              );
            }
          } catch (err: any) {
            reject(new Error("解析微信支付返回数据失败: " + err.message));
          }
        });
      });

      req.on("error", (err) => {
        reject(new Error("请求微信支付接口失败: " + err.message));
      });

      req.on("timeout", () => {
        req.destroy();
        reject(new Error("请求微信支付接口超时（3分钟）"));
      });

      req.end();
    });

    // 如果查询到支付成功，检查并更新数据库
    if (result.trade_state === "SUCCESS") {
      try {
        const { db } = await getCloudDB();

        // 查询订单
        const orderResult = await db
          .collection("orders")
          .where({ orderId: orderId })
          .get();

        if (orderResult.data.length > 0) {
          const order = orderResult.data[0];

          // 如果订单状态还不是 SUCCESS，则更新数据库
          if (order.status !== "SUCCESS") {
            console.log(
              `[WeChat Query] 检测到订单 ${orderId} 支付成功，更新数据库...`
            );

            const transactionId = result.transaction_id;
            const paidAt = Date.now();
            const planId = order.planId || "STANDARD"; // 默认标准会员
            const membershipExpiresAt = paidAt + 30 * 24 * 60 * 60 * 1000; // 30天后

            // 计算当前月份（用于重置使用次数）
            const currentDate = new Date(paidAt);
            const currentMonth = `${currentDate.getFullYear()}-${String(
              currentDate.getMonth() + 1
            ).padStart(2, "0")}`;

            // 更新订单状态
            await db
              .collection("orders")
              .where({ orderId: orderId })
              .update({
                data: {
                  status: "SUCCESS",
                  paidAt: paidAt,
                  wechatTransactionId: transactionId,
                },
              });

            // 更新用户会员状态和到期时间
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
              `[WeChat Query] 订单 ${orderId} 支付成功，已更新订单和用户状态（会员计划: ${planId}）`
            );
          } else {
            console.log(
              `[WeChat Query] 订单 ${orderId} 已经处理过，无需重复更新`
            );
          }
        }
      } catch (dbError: any) {
        // 数据库更新失败不影响查询结果返回
        console.error(
          `[WeChat Query] 更新数据库失败（不影响查询结果）:`,
          dbError.message
        );
      }
    }

    return NextResponse.json({
      success: 1,
      data: result,
    });
  } catch (error: any) {
    console.error("查询微信支付订单状态失败:", error);
    return NextResponse.json(
      {
        success: 0,
        message: error.message || "查询订单状态失败",
      },
      { status: 500 }
    );
  }
}
