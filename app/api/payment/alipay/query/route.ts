import { NextRequest, NextResponse } from "next/server";
import { AlipaySdk } from "alipay-sdk";

/**
 * 支付宝订单查询API
 * POST /api/payment/alipay/query
 *
 * 调用 alipay.trade.query 查询订单支付状态
 * 参考：https://opendocs.alipay.com/open/028r8t
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, tradeNo, orgPid, queryOptions } = body;

    if (!orderId && !tradeNo) {
      return NextResponse.json(
        {
          success: false,
          message: "订单ID或支付宝交易号不能为空",
        },
        { status: 400 }
      );
    }

    // 获取环境变量（使用生产环境配置）
    const ALIPAY_APPID = process.env.ALIPAY_APPID || "";
    const ALIPAY_PRIVATE_KEY = process.env.ALIPAY_PRIVATE_KEY || "";
    const ALIPAY_PUBLIC_KEY = process.env.ALIPAY_PUBLIC_KEY || "";
    const ALIPAY_GATEWAY =
      process.env.ALIPAY_GATEWAY || "https://openapi.alipay.com/gateway.do";
    const ALIPAY_SIGN_TYPE = process.env.ALIPAY_SIGN_TYPE || "RSA2";

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
      timeout: 180000, // 3 分钟超时
    });

    // 构建业务参数
    // 参考：https://opendocs.alipay.com/open/028r8t
    const bizContent: any = {};

    // 商户订单号（out_trade_no）和支付宝交易号（trade_no）二选一
    // 优先使用 trade_no（支付宝交易号），因为它更准确
    if (tradeNo) {
      bizContent.trade_no = tradeNo;
    } else if (orderId) {
      bizContent.out_trade_no = orderId;
    }
    if (orgPid) {
      bizContent.org_pid = orgPid;
    }
    if (queryOptions && Array.isArray(queryOptions)) {
      bizContent.query_options = queryOptions;
    }

    // 调用统一收单线下交易查询接口
    const result = await alipaySdk.exec("alipay.trade.query", {
      bizContent,
    });

    // 解析支付宝返回结果
    const responseData = result as any;

    // 支付宝返回的响应格式是扁平化的，直接包含查询结果
    // code: "10000" 表示成功，其他值表示失败
    const responseCode = responseData.code;
    const responseMsg = responseData.msg;

    // 检查响应码，如果不是 "10000"，表示查询失败
    if (responseCode !== "10000") {
      // 如果订单不存在
      if (
        responseCode === "40004" ||
        responseMsg?.includes("TRADE_NOT_EXIST") ||
        responseMsg?.includes("交易不存在") ||
        responseMsg?.includes("订单不存在")
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `订单不存在（订单号: ${orderId || tradeNo || "未知"}）`,
            errorCode: responseCode,
            errorMsg: responseMsg,
          },
          { status: 404 }
        );
      }

      // 其他错误
      return NextResponse.json(
        {
          success: false,
          message: responseMsg || "查询订单失败",
          errorCode: responseCode,
          errorMsg: responseMsg,
        },
        { status: 400 }
      );
    }

    // 响应成功，直接使用 responseData 中的字段
    const tradeStatus = responseData.tradeStatus || responseData.trade_status;
    const outTradeNo = responseData.outTradeNo || responseData.out_trade_no;
    const tradeNoFromResponse = responseData.tradeNo || responseData.trade_no;

    // 判断订单状态
    // 支付宝交易状态：WAIT_BUYER_PAY（交易创建，等待买家付款）、TRADE_CLOSED（未付款交易超时关闭，或支付完成后全额退款）、TRADE_SUCCESS（交易支付成功）、TRADE_FINISHED（交易结束，不可退款）
    let orderStatus = "UNKNOWN";
    if (tradeStatus) {
      if (tradeStatus === "TRADE_SUCCESS" || tradeStatus === "TRADE_FINISHED") {
        orderStatus = "SUCCESS";
      } else if (tradeStatus === "TRADE_CLOSED") {
        orderStatus = "CANCELLED";
      } else if (tradeStatus === "WAIT_BUYER_PAY") {
        orderStatus = "PENDING";
      } else {
        orderStatus = "FAILED";
      }
    } else {
      // 如果没有交易状态，可能是响应格式异常
      return NextResponse.json(
        {
          success: false,
          message: `订单查询失败：响应数据格式异常（订单号: ${
            orderId || tradeNo || "未知"
          }）`,
        },
        { status: 500 }
      );
    }

    // 返回查询结果
    return NextResponse.json({
      success: true,
      data: {
        orderId: orderId || outTradeNo,
        tradeNo: tradeNoFromResponse || tradeNo,
        tradeStatus: tradeStatus,
        orderStatus: orderStatus,
        totalAmount: responseData.totalAmount || responseData.total_amount,
        buyerLogonId: responseData.buyerLogonId || responseData.buyer_logon_id,
        sendPayDate: responseData.sendPayDate || responseData.send_pay_date,
      },
      message: "订单查询成功",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "查询订单失败",
      },
      { status: 500 }
    );
  }
}
