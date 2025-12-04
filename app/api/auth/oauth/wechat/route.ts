import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * 获取微信登录授权URL
 * GET /api/auth/oauth/wechat?type=pc|h5
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "pc"; // pc 或 h5

    // 根据类型选择不同的配置
    let appid: string;
    let redirectUri: string;

    if (type === "h5") {
      // H5端使用公众号配置
      appid = process.env.WECHAT_MP_APPID || "";
      const origin = request.headers.get("origin") || request.nextUrl.origin;
      redirectUri = `${origin}/api/auth/oauth/wechat/callback?type=h5`;
    } else {
      // PC端使用开放平台配置
      appid = process.env.WECHAT_OPEN_APPID || "";
      const origin = request.headers.get("origin") || request.nextUrl.origin;
      redirectUri = `${origin}/api/auth/oauth/wechat/callback?type=pc`;
    }

    if (!appid) {
      return NextResponse.json(
        {
          success: 0,
          message: "微信登录配置不完整",
        },
        { status: 500 }
      );
    }

    // 生成随机state用于防CSRF攻击
    const state = crypto.randomBytes(16).toString("hex");

    let authorizeUrl: string;
    if (type === "h5") {
      // H5端授权URL
      authorizeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
    } else {
      // PC端扫码登录URL
      authorizeUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;
    }

    return NextResponse.json({
      success: 1,
      data: {
        authorizeUrl,
        state,
      },
    });
  } catch (error: any) {
    console.error("获取微信授权URL失败:", error);
    return NextResponse.json(
      {
        success: 0,
        message: error.message || "获取授权URL失败",
      },
      { status: 500 }
    );
  }
}
