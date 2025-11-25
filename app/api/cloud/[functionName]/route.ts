import { NextRequest, NextResponse } from "next/server";
import { getCloudDB } from "@/lib/db";
import { getTodayDateString, normalizeDateString } from "@/lib/date-utils";

/**
 * 调用云函数（服务端）
 * POST /api/cloud/[functionName]
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ functionName: string }> }
) {
  try {
    // 初始化云开发并获取数据库实例
    const { db } = await getCloudDB();

    // Next.js 15+ 中 params 是 Promise
    const resolvedParams = await params;
    const functionName = resolvedParams.functionName;
    const body = await request.json();

    // 根据云函数名称调用对应的云函数
    if (functionName === "auth") {
      return await handleAuth(body, db);
    } else if (functionName === "user") {
      return await handleUser(body, db);
    } else if (functionName === "history") {
      return await handleHistory(body, db);
    } else {
      return NextResponse.json(
        { success: 0, message: "未知的云函数" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("调用云函数失败:", error);
    return NextResponse.json(
      { success: 0, message: error.message || "调用云函数失败" },
      { status: 500 }
    );
  }
}

/**
 * 处理 auth 云函数
 */
async function handleAuth(body: any, db: any) {
  const { action, phone, password } = body;

  if (action === "login") {
    // 登录即注册：先查找用户，不存在则创建
    const result = await db
      .collection("users")
      .where({
        phone: phone,
      })
      .get();

    let user;

    if (result.data.length === 0) {
      // 用户不存在，自动创建新用户
      const today = getTodayDateString();
      const newUser = {
        phone: phone,
        password: password, // 实际生产环境应该加密
        userTier: "FREE",
        sceneUsage: { date: today, count: 0 },
        memeUsage: { date: today, count: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const addResult = await db.collection("users").add({
        data: newUser,
      });

      user = {
        _id: addResult._id,
        ...newUser,
      };
    } else {
      // 用户存在，验证密码
      user = result.data[0];
      if (user.password !== password) {
        return NextResponse.json({
          success: 0,
          message: "密码错误",
        });
      }
    }

    return NextResponse.json({
      success: 1,
      data: {
        userId: user._id,
        phone: user.phone,
        userTier: user.userTier || "FREE",
        sceneUsage: user.sceneUsage || {
          date: new Date().toLocaleDateString(),
          count: 0,
        },
        memeUsage: user.memeUsage || {
          date: new Date().toLocaleDateString(),
          count: 0,
        },
      },
    });
  } else if (action === "register") {
    // 注册
    // 检查手机号是否已存在
    const existResult = await db
      .collection("users")
      .where({
        phone: phone,
      })
      .get();

    if (existResult.data.length > 0) {
      return NextResponse.json({
        success: 0,
        message: "该手机号已注册",
      });
    }

    // 创建新用户
      const today = getTodayDateString();
    const newUser = {
      phone: phone,
      password: password, // 实际生产环境应该加密
      userTier: "FREE",
      sceneUsage: { date: today, count: 0 },
      memeUsage: { date: today, count: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const addResult = await db.collection("users").add({
      data: newUser,
    });

    return NextResponse.json({
      success: 1,
      data: {
        userId: addResult._id,
        phone: newUser.phone,
        userTier: newUser.userTier,
        sceneUsage: newUser.sceneUsage,
        memeUsage: newUser.memeUsage,
      },
    });
  } else {
    return NextResponse.json({
      success: 0,
      message: "未知操作",
    });
  }
}

/**
 * 处理 user 云函数
 */
async function handleUser(body: any, db: any) {
  const { action, userId, increment, userTier } = body;

  if (!userId) {
    return NextResponse.json({
      success: 0,
      message: "用户ID不能为空",
    });
  }

      const today = getTodayDateString();

  if (action === "getInfo") {
    // 获取用户信息
    const result = await db.collection("users").doc(userId).get();

    if (!result.data) {
      return NextResponse.json({
        success: 0,
        message: "用户不存在",
      });
    }

    const user = result.data;

    // 检查是否需要重置每日使用量
    let sceneUsage = user.sceneUsage || { date: today, count: 0 };
    let memeUsage = user.memeUsage || { date: today, count: 0 };

    // 统一日期格式后比较
    const sceneUsageDate = normalizeDateString(sceneUsage.date);
    const memeUsageDate = normalizeDateString(memeUsage.date);

    if (sceneUsageDate !== today) {
      sceneUsage = { date: today, count: 0 };
    } else {
      // 确保日期格式统一
      sceneUsage = { ...sceneUsage, date: today };
    }
    if (memeUsageDate !== today) {
      memeUsage = { date: today, count: 0 };
    } else {
      // 确保日期格式统一
      memeUsage = { ...memeUsage, date: today };
    }

    return NextResponse.json({
      success: 1,
      data: {
        userId: user._id,
        phone: user.phone,
        userTier: user.userTier || "FREE",
        sceneUsage: sceneUsage,
        memeUsage: memeUsage,
      },
    });
  } else if (action === "updateSceneUsage") {
    // 更新场景扩展使用次数
    const userResult = await db.collection("users").doc(userId).get();

    if (!userResult.data) {
      return NextResponse.json({
        success: 0,
        message: "用户不存在",
      });
    }

    const user = userResult.data;
    let sceneUsage = user.sceneUsage || { date: today, count: 0 };

    // 统一日期格式后比较
    const sceneUsageDate = normalizeDateString(sceneUsage.date);

    // 如果日期不同，重置计数
    if (sceneUsageDate !== today) {
      sceneUsage = { date: today, count: increment || 1 };
    } else {
      sceneUsage.count = (sceneUsage.count || 0) + (increment || 1);
      sceneUsage.date = today; // 确保日期格式统一
    }

    await db
      .collection("users")
      .doc(userId)
      .update({
        data: {
          sceneUsage: sceneUsage,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({
      success: 1,
      data: {
        sceneUsage: sceneUsage,
      },
    });
  } else if (action === "updateMemeUsage") {
    // 更新表情包制作使用次数
    const userResult = await db.collection("users").doc(userId).get();

    if (!userResult.data) {
      return NextResponse.json({
        success: 0,
        message: "用户不存在",
      });
    }

    const user = userResult.data;
    let memeUsage = user.memeUsage || { date: today, count: 0 };

    // 统一日期格式后比较
    const memeUsageDate = normalizeDateString(memeUsage.date);

    // 如果日期不同，重置计数
    if (memeUsageDate !== today) {
      memeUsage = { date: today, count: increment || 1 };
    } else {
      memeUsage.count = (memeUsage.count || 0) + (increment || 1);
      memeUsage.date = today; // 确保日期格式统一
    }

    await db
      .collection("users")
      .doc(userId)
      .update({
        data: {
          memeUsage: memeUsage,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({
      success: 1,
      data: {
        memeUsage: memeUsage,
      },
    });
  } else if (action === "updateTier") {
    // 更新用户会员等级
    await db
      .collection("users")
      .doc(userId)
      .update({
        data: {
          userTier: userTier,
          updatedAt: new Date(),
        },
      });

    const userResult = await db.collection("users").doc(userId).get();

    const user = userResult.data;

    return NextResponse.json({
      success: 1,
      data: {
        userId: user._id,
        phone: user.phone,
        userTier: user.userTier,
        sceneUsage: user.sceneUsage || { date: today, count: 0 },
        memeUsage: user.memeUsage || { date: today, count: 0 },
      },
    });
  } else {
    return NextResponse.json({
      success: 0,
      message: "未知操作",
    });
  }
}

/**
 * 处理 history 云函数
 */
async function handleHistory(body: any, db: any) {
  const { action, userId, type, url, prompt, style, historyId, limit } = body;

  if (action === "save") {
    // 保存历史记录
    const historyItem = {
      userId: userId || null,
      type: type, // 'scene' 或 'meme'
      url: url,
      prompt: prompt,
      style: style || null,
      timestamp: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const addResult = await db.collection("history").add({
      data: historyItem,
    });

    return NextResponse.json({
      success: 1,
      data: {
        id: addResult._id,
        userId: historyItem.userId,
        type: historyItem.type,
        url: historyItem.url,
        prompt: historyItem.prompt,
        style: historyItem.style,
        timestamp: historyItem.timestamp,
      },
    });
  } else if (action === "getList") {
    // 获取历史记录列表
    if (!userId) {
      return NextResponse.json({
        success: 0,
        message: "用户ID不能为空",
      });
    }

    const query = db.collection("history").where({
      userId: userId,
    }).orderBy("timestamp", "desc").limit(limit || 50);

    const result = await query.get();
    const historyList = result.data.map((item: any) => ({
      id: item._id,
      userId: item.userId,
      type: item.type,
      url: item.url,
      prompt: item.prompt,
      style: item.style,
      timestamp: item.timestamp,
    }));

    return NextResponse.json({
      success: 1,
      data: historyList,
    });
  } else if (action === "delete") {
    // 删除历史记录
    if (!userId || !historyId) {
      return NextResponse.json({
        success: 0,
        message: "用户ID和历史记录ID不能为空",
      });
    }

    // 验证历史记录是否属于该用户
    const historyResult = await db.collection("history").doc(historyId).get();
    const historyItem = historyResult.data;

    if (!historyItem) {
      return NextResponse.json({
        success: 0,
        message: "历史记录不存在",
      });
    }

    if (historyItem.userId !== userId) {
      return NextResponse.json({
        success: 0,
        message: "无权删除该历史记录",
      });
    }

    await db.collection("history").doc(historyId).remove();

    return NextResponse.json({
      success: 1,
      message: "删除成功",
    });
  } else {
    return NextResponse.json({
      success: 0,
      message: "未知操作",
    });
  }
}
