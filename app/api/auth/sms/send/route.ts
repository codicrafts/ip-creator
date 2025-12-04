import { NextRequest, NextResponse } from "next/server";
import { getCloudDB } from "@/lib/db";
import crypto from "crypto";
import { fetchWithTimeout } from "@/lib/request";

/**
 * 发送短信验证码
 * POST /api/auth/sms/send
 * Body: { phone: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return NextResponse.json(
        {
          success: 0,
          message: "请输入正确的手机号",
        },
        { status: 400 }
      );
    }

    // 检查环境变量配置（使用提供的配置或环境变量）
    const ALIYUN_ACCESS_KEY_ID = process.env.ALIYUN_ACCESS_KEY_ID;
    const ALIYUN_ACCESS_KEY_SECRET = process.env.ALIYUN_ACCESS_KEY_SECRET;
    const ALIYUN_SMS_SIGN_NAME = process.env.ALIYUN_SMS_SIGN_NAME;
    const ALIYUN_SMS_TEMPLATE_CODE = process.env.ALIYUN_SMS_TEMPLATE_CODE;

    if (
      !ALIYUN_ACCESS_KEY_ID ||
      !ALIYUN_ACCESS_KEY_SECRET ||
      !ALIYUN_SMS_SIGN_NAME ||
      !ALIYUN_SMS_TEMPLATE_CODE
    ) {
      return NextResponse.json(
        {
          success: 0,
          message: "短信服务配置不完整",
        },
        { status: 500 }
      );
    }

    // 防暴力破解：检查发送频率限制
    const { db } = await getCloudDB();
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000; // 1小时前

    // 查询该手机号1小时内的发送记录
    const sendHistory = await db
      .collection("sms_codes")
      .where({
        phone: phone,
      })
      .get();

    // 统计1小时内的发送次数
    const recentSends = sendHistory.data.filter(
      (record: any) =>
        record.createdAt && new Date(record.createdAt).getTime() > oneHourAgo
    );

    // 限制：1小时内最多发送5次
    if (recentSends.length >= 5) {
      return NextResponse.json(
        {
          success: 0,
          message: "发送过于频繁，请1小时后再试",
        },
        { status: 429 }
      );
    }

    // 检查是否在60秒内重复发送（防刷）
    const lastSend = sendHistory.data.sort((a: any, b: any) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    })[0];

    if (lastSend && lastSend.createdAt) {
      const lastSendTime = new Date(lastSend.createdAt).getTime();
      const timeSinceLastSend = now - lastSendTime;
      if (timeSinceLastSend < 60 * 1000) {
        // 60秒内不能重复发送
        const remainingSeconds = Math.ceil(
          (60 * 1000 - timeSinceLastSend) / 1000
        );
        return NextResponse.json(
          {
            success: 0,
            message: `请${remainingSeconds}秒后再试`,
          },
          { status: 429 }
        );
      }
    }

    // 生成6位数字验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 调用阿里云短信服务发送验证码
    // 模板参数格式：根据模板要求，通常是 {code} 或 {code, min}
    const smsResult = await sendSMS({
      accessKeyId: ALIYUN_ACCESS_KEY_ID,
      accessKeySecret: ALIYUN_ACCESS_KEY_SECRET,
      phoneNumbers: phone,
      signName: ALIYUN_SMS_SIGN_NAME,
      templateCode: ALIYUN_SMS_TEMPLATE_CODE,
      templateParam: JSON.stringify({ code, min: 5 }), // code: 验证码, min: 有效期（分钟）
    });

    if (smsResult.success !== 1) {
      return NextResponse.json(
        {
          success: 0,
          message: smsResult.message || "发送验证码失败",
        },
        { status: 500 }
      );
    }

    // 将验证码存储到数据库（设置5分钟过期时间）
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5分钟后过期

    // 先删除该手机号的旧验证码（确保唯一性）
    const oldCodes = await db
      .collection("sms_codes")
      .where({
        phone: phone,
      })
      .get();

    // 批量删除旧验证码
    if (oldCodes.data.length > 0) {
      const deletePromises = oldCodes.data.map((record: any) =>
        db.collection("sms_codes").doc(record._id).remove()
      );
      await Promise.all(deletePromises);
    }

    // 保存新验证码（确保唯一性）
    await db.collection("sms_codes").add({
      data: {
        phone: phone,
        code: code,
        expiresAt: expiresAt,
        createdAt: new Date(),
        verified: false, // 标记是否已验证
        verifyAttempts: 0, // 验证尝试次数
      },
    });

    // 开发环境返回验证码（方便测试），生产环境不返回
    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json({
      success: 1,
      message: "验证码已发送",
      data: {
        ...(isDev && { code }), // 仅开发环境返回验证码
      },
    });
  } catch (error: any) {
    console.error("发送短信验证码失败:", error);
    return NextResponse.json(
      {
        success: 0,
        message: error.message || "发送验证码失败",
      },
      { status: 500 }
    );
  }
}

/**
 * 调用阿里云短信服务API
 */
async function sendSMS(params: {
  accessKeyId: string;
  accessKeySecret: string;
  phoneNumbers: string;
  signName: string;
  templateCode: string;
  templateParam: string;
}): Promise<{ success: number; message?: string }> {
  try {
    // 使用阿里云API签名算法
    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    const nonce = crypto.randomBytes(16).toString("hex");

    // 构建请求参数
    const requestParams: Record<string, string> = {
      AccessKeyId: params.accessKeyId,
      Action: "SendSms",
      Format: "JSON",
      PhoneNumbers: params.phoneNumbers,
      RegionId: "cn-hangzhou",
      SignName: params.signName,
      SignatureMethod: "HMAC-SHA1",
      SignatureNonce: nonce,
      SignatureVersion: "1.0",
      TemplateCode: params.templateCode,
      TemplateParam: params.templateParam,
      Timestamp: timestamp,
      Version: "2017-05-25",
    };

    // 生成签名
    const signature = generateSignature(
      requestParams,
      params.accessKeySecret,
      "POST"
    );

    // 构建请求URL
    const url = `https://dysmsapi.aliyuncs.com/?${buildQueryString({
      ...requestParams,
      Signature: signature,
    })}`;

    // 发送请求
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const result = await response.json();

    if (result.Code === "OK") {
      return { success: 1 };
    } else {
      return {
        success: 0,
        message: result.Message || "发送短信失败",
      };
    }
  } catch (error: any) {
    console.error("调用阿里云短信API失败:", error);
    return {
      success: 0,
      message: error.message || "调用短信服务失败",
    };
  }
}

/**
 * 生成阿里云API签名
 * 参考：https://help.aliyun.com/document_detail/101343.html
 */
function generateSignature(
  params: Record<string, string>,
  accessKeySecret: string,
  method: string
): string {
  // 1. 对参数进行排序（按字典序）
  const sortedKeys = Object.keys(params).sort();

  // 2. 构建查询字符串（需要特殊URL编码）
  const canonicalizedQueryString = sortedKeys
    .map((key) => {
      // 对key和value分别进行URL编码，但需要特殊处理
      const encodedKey = percentEncode(key);
      const encodedValue = percentEncode(params[key]);
      return `${encodedKey}=${encodedValue}`;
    })
    .join("&");

  // 3. 构建待签名字符串
  const stringToSign = `${method}&${percentEncode("/")}&${percentEncode(
    canonicalizedQueryString
  )}`;

  // 4. 使用HMAC-SHA1生成签名
  const hmac = crypto.createHmac("sha1", accessKeySecret + "&");
  hmac.update(stringToSign);
  const signature = hmac.digest("base64");

  return signature;
}

/**
 * 阿里云API要求的特殊URL编码
 * 除了RFC 3986规定的保留字符外，还需要编码其他特殊字符
 */
function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
}

/**
 * 构建查询字符串（用于URL）
 */
function buildQueryString(params: Record<string, string>): string {
  return Object.keys(params)
    .map((key) => {
      // URL查询参数使用标准URL编码
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    })
    .join("&");
}
