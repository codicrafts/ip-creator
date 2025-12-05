import { NextRequest, NextResponse } from "next/server";
import { getCloudDB } from "@/lib/db";
import { getTodayDateString } from "@/lib/date-utils";

/**
 * 验证短信验证码并登录/注册
 * POST /api/auth/sms/verify
 * Body: { phone: string, code: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

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

    // 验证验证码格式
    if (!code || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          success: 0,
          message: "请输入6位数字验证码",
        },
        { status: 400 }
      );
    }

    const { db } = await getCloudDB();

    // 查找验证码记录
    const codeResult = await db
      .collection("sms_codes")
      .where({
        phone: phone,
      })
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (codeResult.data.length === 0) {
      return NextResponse.json({
        success: 0,
        message: "验证码不存在，请先发送验证码",
      });
    }

    const codeRecord = codeResult.data[0];

    // 检查验证码是否已使用
    if (codeRecord.verified === true) {
      return NextResponse.json({
        success: 0,
        message: "验证码已使用，请重新获取",
      });
    }

    // 检查验证码是否过期（5分钟有效期）
    // 处理 expiresAt 可能是时间戳或 Date 对象的情况
    let expiresAtTimestamp: number;
    if (codeRecord.expiresAt instanceof Date) {
      expiresAtTimestamp = codeRecord.expiresAt.getTime();
    } else if (typeof codeRecord.expiresAt === 'number') {
      expiresAtTimestamp = codeRecord.expiresAt;
    } else {
      // 如果没有 expiresAt 字段，视为已过期（兼容旧数据）
      await db.collection("sms_codes").doc(codeRecord._id).remove();
      return NextResponse.json({
        success: 0,
        message: "验证码已过期，请重新获取",
      });
    }

    const now = Date.now();
    if (now > expiresAtTimestamp) {
      // 删除过期验证码
      await db.collection("sms_codes").doc(codeRecord._id).remove();
      return NextResponse.json({
        success: 0,
        message: "验证码已过期，请重新获取",
      });
    }

    // 防暴力破解：检查验证尝试次数（连续3次错误则锁定10分钟）
    const verifyAttempts = (codeRecord.verifyAttempts || 0) + 1;
    const maxAttempts = 3;
    const lockDuration = 10 * 60 * 1000; // 10分钟
    const lockUntil = codeRecord.lockUntil || 0;

    // 检查是否被锁定
    if (lockUntil > Date.now()) {
      const remainingMinutes = Math.ceil(
        (lockUntil - Date.now()) / (60 * 1000)
      );
      return NextResponse.json({
        success: 0,
        message: `验证失败次数过多，请${remainingMinutes}分钟后再试`,
      });
    }

    // 验证验证码是否正确
    if (codeRecord.code !== code) {
      // 更新验证尝试次数
      const updateData: any = {
        verifyAttempts: verifyAttempts,
      };

      // 如果连续3次错误，锁定10分钟
      if (verifyAttempts >= maxAttempts) {
        updateData.lockUntil = Date.now() + lockDuration;
      }

      await db.collection("sms_codes").doc(codeRecord._id).update({
        data: updateData,
      });

      const remainingAttempts = maxAttempts - verifyAttempts;
      if (remainingAttempts > 0) {
        return NextResponse.json({
          success: 0,
          message: `验证码错误，还可尝试${remainingAttempts}次`,
        });
      } else {
        return NextResponse.json({
          success: 0,
          message: "验证失败次数过多，请10分钟后再试",
        });
      }
    }

    // 验证码正确，标记为已使用并删除验证码记录（防止重复使用）
    await db.collection("sms_codes").doc(codeRecord._id).remove();

    // 查找用户是否存在
    const userResult = await db
      .collection("users")
      .where({
        phone: phone,
      })
      .get();

    let userId: string;
    const today = getTodayDateString();

    if (userResult.data.length === 0) {
      // 用户不存在，创建新用户（注册）
      const newUser = {
        phone: phone,
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
    } else {
      // 用户存在，直接登录
      const user = userResult.data[0];
      userId = user._id;
    }

    // 返回用户信息
    const userDoc = await db.collection("users").doc(userId).get();
    const user = userDoc.data;

    // 检查是否为新用户（没有密码）
    const isNewUser = !user.password;

    return NextResponse.json({
      success: 1,
      message: "登录成功",
      data: {
        userId: userId,
        phone: user.phone,
        userTier: user.userTier || "FREE",
        sceneUsage: user.sceneUsage || {
          date: today,
          count: 0,
        },
        memeUsage: user.memeUsage || {
          date: today,
          count: 0,
        },
        isNewUser: isNewUser, // 标识是否为新用户（需要设置密码）
      },
    });
  } catch (error: any) {
    console.error("验证短信验证码失败:", error);
    return NextResponse.json(
      {
        success: 0,
        message: error.message || "验证失败",
      },
      { status: 500 }
    );
  }
}
