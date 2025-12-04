import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/request";
import { getCloudDB } from "@/lib/db";
import { getTodayDateString } from "@/lib/date-utils";

/**
 * 微信授权回调处理
 * GET /api/auth/oauth/wechat/callback?code=xxx&state=xxx&type=pc|h5
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const type = searchParams.get("type") || "pc";

    // 检查code是否存在
    if (!code) {
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      console.error("微信授权失败:", error, errorDescription);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(errorDescription || "授权失败")}`,
          request.url
        )
      );
    }

    // 根据类型选择不同的配置
    let appid: string;
    let appsecret: string;
    let accessTokenUrl: string;

    if (type === "h5") {
      appid = process.env.WECHAT_MP_APPID || "";
      appsecret = process.env.WECHAT_MP_APPSECRET || "";
      accessTokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${code}&grant_type=authorization_code`;
    } else {
      appid = process.env.WECHAT_OPEN_APPID || "";
      appsecret = process.env.WECHAT_OPEN_APPSECRET || "";
      accessTokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${code}&grant_type=authorization_code`;
    }

    if (!appid || !appsecret) {
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent("微信登录配置不完整")}`,
          request.url
        )
      );
    }

    // 通过code换取access_token
    const tokenResponse = await fetchWithTimeout(accessTokenUrl, {}, 180000);
    const tokenData = await tokenResponse.json();

    if (tokenData.errcode) {
      console.error("获取access_token失败:", tokenData);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(
            tokenData.errmsg || "获取授权失败"
          )}`,
          request.url
        )
      );
    }

    const { access_token, openid } = tokenData;

    // 获取用户信息
    let userInfo: any = null;
    try {
      const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
      const userInfoResponse = await fetchWithTimeout(userInfoUrl, {}, 180000);
      const userInfoData = await userInfoResponse.json();

      if (userInfoData.errcode) {
        console.warn("获取用户信息失败，但openid可用:", userInfoData);
        userInfo = { openid };
      } else {
        userInfo = userInfoData;
      }
    } catch (error) {
      console.warn("获取用户信息异常，使用openid:", error);
      userInfo = { openid };
    }

    // 处理用户登录/注册
    const { db } = await getCloudDB();
    const today = getTodayDateString();

    // 查找是否已有该openid的用户
    const existingUserResult = await db
      .collection("users")
      .where({
        wechatOpenid: openid,
      })
      .get();

    let userId: string;

    if (existingUserResult.data.length > 0) {
      // 用户已存在，直接登录
      const user = existingUserResult.data[0];
      userId = user._id;

      // 更新用户信息
      if (userInfo.nickname || userInfo.headimgurl) {
        await db
          .collection("users")
          .doc(userId)
          .update({
            data: {
              wechatNickname: userInfo.nickname || user.wechatNickname,
              wechatAvatar: userInfo.headimgurl || user.wechatAvatar,
              updatedAt: new Date(),
            },
          });
      }
    } else {
      // 新用户，创建账号
      const newUser = {
        wechatOpenid: openid,
        wechatNickname: userInfo.nickname || null,
        wechatAvatar: userInfo.headimgurl || null,
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
    console.error("微信登录回调处理失败:", error);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error.message || "登录失败")}`,
        request.url
      )
    );
  }
}
