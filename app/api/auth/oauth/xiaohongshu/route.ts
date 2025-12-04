import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * 获取小红书登录授权URL
 * GET /api/auth/oauth/xiaohongshu
 */
export async function GET(request: NextRequest) {
  try {
    const XHS_APP_ID = process.env.XHS_APP_ID || "";
    const XHS_APP_SECRET = process.env.XHS_APP_SECRET || "";

    if (!XHS_APP_ID || !XHS_APP_SECRET) {
      return NextResponse.json(
        {
          success: 0,
          message: "小红书登录配置不完整",
        },
        { status: 500 }
      );
    }

    const origin = request.headers.get("origin") || request.nextUrl.origin;
    const redirectUri = `${origin}/api/auth/oauth/xiaohongshu/callback`;

    // 生成随机state用于防CSRF攻击
    const state = crypto.randomBytes(16).toString("hex");

    // 小红书OAuth授权URL
    // 注意：小红书OAuth文档可能需要根据实际API调整
    const authorizeUrl = `https://creator.xiaohongshu.com/oauth/authorize?client_id=${XHS_APP_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=user_info&state=${state}`;

    return NextResponse.json({
      success: 1,
      data: {
        authorizeUrl,
        state,
      },
    });
  } catch (error: any) {
    console.error("获取小红书授权URL失败:", error);
    return NextResponse.json(
      {
        success: 0,
        message: error.message || "获取授权URL失败",
      },
      { status: 500 }
    );
  }
}
