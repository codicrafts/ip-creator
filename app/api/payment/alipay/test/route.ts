import { NextRequest, NextResponse } from "next/server";
import { AlipaySdk } from "alipay-sdk";

/**
 * 支付宝沙箱测试API
 * POST /api/payment/alipay/test
 *
 * 支持的操作：
 * 1. create - 创建支付链接（链路测试-商家创建支付链接）
 * 2. query - 查询订单状态（链路测试-商家查询收单交易结果）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, orderId, amount, subject } = body;

    // 获取环境变量（使用沙箱专用配置）
    const ALIPAY_APPID = process.env.SENDBOX_ALIPAY_APPID || "";
    const ALIPAY_PRIVATE_KEY = process.env.SENDBOX_PRIVATE_KEY || "";
    const ALIPAY_PUBLIC_KEY =
      process.env.SENDBOX_ALIPAY_PUBLIC_KEY ||
      process.env.SENDBOX__ALIPAY_PUBLIC_KEY ||
      "";
    // 沙箱环境使用沙箱网关
    const ALIPAY_GATEWAY =
      process.env.SENDBOX_ALIPAY_GATEWAY ||
      "https://openapi.alipaydev.com/gateway.do";
    const ALIPAY_SIGN_TYPE = process.env.ALIPAY_SIGN_TYPE || "RSA2";
    const ALIPAY_NOTIFY_URL =
      process.env.ALIPAY_NOTIFY_URL ||
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/payment/alipay/notify`;
    const ALIPAY_RETURN_URL = `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/profile`;

    // 检查必要的配置
    if (!ALIPAY_APPID || !ALIPAY_PRIVATE_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "支付宝配置不完整：缺少 APPID 或私钥",
        },
        { status: 500 }
      );
    }

    // 处理私钥格式
    let processedPrivateKey = ALIPAY_PRIVATE_KEY.replace(/\\n/g, "\n");
    if (!processedPrivateKey.includes("BEGIN")) {
      if (!processedPrivateKey.includes("PRIVATE KEY")) {
        processedPrivateKey = `-----BEGIN RSA PRIVATE KEY-----\n${processedPrivateKey}\n-----END RSA PRIVATE KEY-----`;
      }
    }

    // 处理支付宝公钥格式
    let processedPublicKey = ALIPAY_PUBLIC_KEY
      ? ALIPAY_PUBLIC_KEY.replace(/\\n/g, "\n")
      : "";

    // 初始化 AlipaySdk
    const gatewayUrl =
      ALIPAY_GATEWAY || "https://openapi.alipay.com/gateway.do";

    const alipaySdk = new AlipaySdk({
      appId: ALIPAY_APPID,
      privateKey: processedPrivateKey,
      alipayPublicKey: processedPublicKey || undefined,
      gateway: gatewayUrl,
      signType: ALIPAY_SIGN_TYPE as "RSA" | "RSA2",
      timeout: 5000,
    });

    if (action === "create") {
      // 链路测试-商家创建支付链接
      const testOrderId =
        orderId ||
        `TEST_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      const testAmount = amount || "0.01"; // 测试金额，默认0.01元
      const testSubject = subject || "测试商品"; // 按照支付宝沙箱测试示例

      // 按照支付宝沙箱测试的入参格式
      const bizContent = {
        out_trade_no: testOrderId,
        total_amount: testAmount,
        subject: testSubject,
        product_code: "FAST_INSTANT_TRADE_PAY",
      };

      console.log(
        "bizContent",
        bizContent,
        ALIPAY_APPID,
        ALIPAY_PRIVATE_KEY,
        ALIPAY_PUBLIC_KEY,
        ALIPAY_GATEWAY,
        ALIPAY_SIGN_TYPE,
        ALIPAY_NOTIFY_URL,
        ALIPAY_RETURN_URL
      );

      // 调用统一收单下单并支付页面接口
      const paymentUrl = alipaySdk.pageExecute("alipay.trade.page.pay", "GET", {
        bizContent,
        returnUrl: ALIPAY_RETURN_URL,
        notifyUrl: ALIPAY_NOTIFY_URL,
      });

      return NextResponse.json({
        success: true,
        data: {
          orderId: testOrderId,
          paymentUrl: paymentUrl,
          amount: testAmount,
          subject: testSubject,
        },
        message: "支付链接创建成功",
      });
    } else if (action === "query") {
      // 链路测试-商家查询收单交易结果
      if (!orderId) {
        return NextResponse.json(
          {
            success: false,
            message: "订单ID不能为空",
          },
          { status: 400 }
        );
      }

      // 调用统一收单线下交易查询接口
      // 参考：https://opendocs.alipay.com/open/028r8t
      const bizContent = {
        out_trade_no: orderId, // 商户订单号
      };

      const result = await alipaySdk.exec("alipay.trade.query", {
        bizContent,
      });

      return NextResponse.json({
        success: true,
        data: {
          orderId: orderId,
          queryResult: result,
        },
        message: "订单查询成功",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "不支持的操作类型",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("支付宝测试API错误:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "操作失败",
        error: error.toString(),
      },
      { status: 500 }
    );
  }
}
