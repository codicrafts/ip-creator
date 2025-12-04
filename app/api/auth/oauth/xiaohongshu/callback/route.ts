import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/request";
import { getCloudDB } from "@/lib/db";
import { getTodayDateString } from "@/lib/date-utils";

/**
 * 小红书授权回调处理
 * GET /api/auth/oauth/xiaohongshu/callback?code=xxx&state=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // 检查code是否存在
    if (!code) {
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      console.error("小红书授权失败:", error, errorDescription);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(errorDescription || "授权失败")}`,
          request.url
        )
      );
    }

    const XHS_APP_ID = process.env.XHS_APP_ID || "";
    const XHS_APP_SECRET = process.env.XHS_APP_SECRET || "";

    if (!XHS_APP_ID || !XHS_APP_SECRET) {
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent("小红书登录配置不完整")}`,
          request.url
        )
      );
    }

    // 通过code换取access_token
    // 注意：小红书OAuth API需要根据实际文档调整
    const tokenUrl = `https://creator.xiaohongshu.com/oauth/access_token`;
    const tokenResponse = await fetchWithTimeout(
      tokenUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: XHS_APP_ID,
          client_secret: XHS_APP_SECRET,
          code: code,
          grant_type: "authorization_code",
        }),
      },
      180000 // 3 分钟超时
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("获取access_token失败:", tokenData);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(
            tokenData.error_description || "获取授权失败"
          )}`,
          request.url
        )
      );
    }

    const { access_token, open_id } = tokenData;

    // 获取用户信息
    let userInfo: any = null;
    try {
      const userInfoUrl = `https://creator.xiaohongshu.com/api/user/info`;
      const userInfoResponse = await fetchWithTimeout(
        userInfoUrl,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
        180000 // 3 分钟超时
      );
      const userInfoData = await userInfoResponse.json();

      if (userInfoData.error) {
        console.warn("获取用户信息失败，但open_id可用:", userInfoData);
        userInfo = { open_id };
      } else {
        userInfo = userInfoData;
      }
    } catch (error) {
      console.warn("获取用户信息异常，使用open_id:", error);
      userInfo = { open_id };
    }

    // 处理用户登录/注册
    const { db } = await getCloudDB();
    const today = getTodayDateString();

    // 查找是否已有该open_id的用户
    const existingUserResult = await db
      .collection("users")
      .where({
        xhsOpenId: open_id,
      })
      .get();

    let userId: string;

    if (existingUserResult.data.length > 0) {
      // 用户已存在，直接登录
      const user = existingUserResult.data[0];
      userId = user._id;

      // 更新用户信息
      if (userInfo.nickname || userInfo.avatar) {
        await db
          .collection("users")
          .doc(userId)
          .update({
            data: {
              xhsNickname: userInfo.nickname || user.xhsNickname,
              xhsAvatar: userInfo.avatar || user.xhsAvatar,
              updatedAt: new Date(),
            },
          });
      }
    } else {
      // 新用户，创建账号
      const newUser = {
        xhsOpenId: open_id,
        xhsNickname: userInfo.nickname || null,
        xhsAvatar: userInfo.avatar || null,
        userTier: "FREE",
        sceneUsage: { date: today, count: 0 },
        memeUsage: { date: today, count: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const addResult = await db.collection("users").add({
        data: newUser,
      });

      userId = addResult._id;
    }

    // 设置cookie并重定向到首页
    const response = NextResponse.redirect(new URL("/", request.url));

    // 设置用户ID到cookie
    response.cookies.set("ip_creative_user_id", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30天
    });

    return response;
  } catch (error: any) {
    console.error("小红书登录回调处理失败:", error);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error.message || "登录失败")}`,
        request.url
      )
    );
  }
}
