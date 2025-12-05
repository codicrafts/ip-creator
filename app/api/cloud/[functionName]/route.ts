import { NextRequest, NextResponse } from "next/server";
import { getCloudDB } from "@/lib/db";
import { getTodayDateString, normalizeDateString } from "@/lib/date-utils";
import crypto from "crypto";
import https from "https";
import { AlipaySdk } from "alipay-sdk";

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
    } else if (functionName === "payment") {
      return await handlePayment(body, db, request);
    } else if (functionName === "uploadImage") {
      return await handleUploadImage(body);
    } else if (functionName === "getImageUrl") {
      return await handleGetImageUrl(body);
    } else if (functionName === "library") {
      return await handleLibrary(body, db);
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
  const { action, phone, password, userId } = body;

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
      const salt = generateSalt();
      const hashedPassword = hashPassword(password, salt);
      
      const newUser = {
        phone: phone,
        password: hashedPassword,
        salt: salt, // 存储盐值，用于验证
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
      
      // 使用存储的盐值哈希输入的密码
      // 兼容老用户（没有 salt 字段）
      const salt = user.salt || user.alt || "";
      console.log("Set password: User salt fields", { 
        salt: user.salt, 
        alt: user.alt, 
        usingSalt: salt 
      });
      
      const hashedInputPassword = hashPassword(password, salt);
      console.log("Set password: Hash comparison", { 
        inputPassword: password,
        salt: salt,
        hashedInputPassword,
        storedPassword: user.password
      });
      
      if (user.password !== hashedInputPassword) {
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
          date: getTodayDateString(),
          count: 0,
        },
        memeUsage: user.memeUsage || {
          date: getTodayDateString(),
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
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);
    const newUser = {
      phone: phone,
      password: hashedPassword,
      salt: salt, // 存储盐值，用于验证
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
  } else if (action === "setPassword") {
    // 设置密码（首次登录/注册时）
    if (!userId || !password) {
      return NextResponse.json({
        success: 0,
        message: "参数错误",
      });
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json({
        success: 0,
        message: "密码至少6位",
      });
    }

    try {
      // 检查用户是否存在
      const userResult = await db.collection("users").doc(userId).get();
      if (!userResult.data) {
        console.error("Set password: User not found", userId);
        return NextResponse.json({
          success: 0,
          message: "用户不存在",
        });
      }

      console.log(
        "Set password: Updating user",
        userId,
        "password length:",
        password.length
      );

      // 生成新的盐值并哈希密码
      const salt = generateSalt();
      const hashedPassword = hashPassword(password, salt);

      // 更新用户密码（微信云开发 update 操作会返回更新结果）
      const updateResult = await db
        .collection("users")
        .doc(userId)
        .update({
          data: {
            password: hashedPassword,
            salt: salt, // 存储新的盐值
            updatedAt: new Date(),
          },
        });

      console.log("Set password: Update completed", updateResult);

      // 等待一小段时间确保更新生效（微信云开发可能需要短暂延迟）
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 验证更新是否成功（读取用户数据确认密码已保存）
      const verifyResult = await db.collection("users").doc(userId).get();
      const updatedUser = verifyResult.data;

      console.log(
        "Set password: Verification - user exists:",
        !!updatedUser,
        "has password:",
        !!updatedUser?.password
      );

      if (!updatedUser) {
        console.error("Set password: User not found after update", userId);
        return NextResponse.json({
          success: 0,
          message: "用户不存在",
        });
      }

      // 验证密码是否保存成功
      const passwordSaved = !!updatedUser.password;
      const passwordMatches = updatedUser.password === hashedPassword;
      
      if (!passwordSaved || !passwordMatches) {
        console.error("Set password: Password not saved correctly", {
          userId,
          hasPassword: passwordSaved,
          passwordMatch: passwordMatches,
          inputPassword: password,
          storedPassword: updatedUser.password,
          inputHashedPassword: hashedPassword,
          salt: salt,
        });
        return NextResponse.json({
          success: 0,
          message: "密码保存失败，请重试",
        });
      }

      console.log("Set password: Success", userId);

      return NextResponse.json({
        success: 1,
        message: "密码设置成功",
      });
    } catch (error: any) {
      console.error("Set password error:", error);
      return NextResponse.json({
        success: 0,
        message: error.message || "设置密码失败",
      });
    }
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

  if (action === "getInfo" || action === "get") {
    // 获取用户信息
    const result = await db.collection("users").doc(userId).get();

    if (!result.data) {
      return NextResponse.json({
        success: 0,
        message: "用户不存在",
      });
    }

    const user = result.data;
    let userTier = user.userTier || "FREE";
    const membershipExpiresAt = user.membershipExpiresAt;
    const membershipStartedAt = user.membershipStartedAt;

    // 检查会员是否过期
    const isPremium = ["BASIC", "STANDARD", "PREMIUM"].includes(userTier);
    if (isPremium && membershipExpiresAt && Date.now() > membershipExpiresAt) {
      // 会员已过期，降级为免费用户
      userTier = "FREE";
      await db
        .collection("users")
        .doc(userId)
        .update({
          data: {
            userTier: "FREE",
            membershipExpiresAt: null,
            membershipStartedAt: null,
          },
        });
    }

    // 检查是否需要重置使用量
    let sceneUsage = user.sceneUsage || { date: today, count: 0 };
    let memeUsage = user.memeUsage || { date: today, count: 0 };

    if (isPremium && membershipStartedAt) {
      // 会员用户：按月重置
      const startDate = new Date(membershipStartedAt);
      const currentDate = new Date();
      const startMonth = `${startDate.getFullYear()}-${String(
        startDate.getMonth() + 1
      ).padStart(2, "0")}`;
      const currentMonth = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}`;

      // 检查 sceneUsage.date 的格式
      const sceneUsageDate = normalizeDateString(sceneUsage.date);
      const isSceneDateFormat = sceneUsageDate.includes("-");

      if (!isSceneDateFormat || sceneUsageDate !== startMonth) {
        // 重置并增加
        sceneUsage = { date: currentMonth, count: 0 };
      } else {
        // 累加
        sceneUsage = {
          ...sceneUsage,
          count: (sceneUsage.count || 0) + (increment || 1),
          date: currentMonth,
        };
      }

      // 检查 memeUsage.date 的格式
      const memeUsageDate = normalizeDateString(memeUsage.date);
      const isMemeDateFormat = memeUsageDate.includes("-");

      if (!isMemeDateFormat || memeUsageDate !== startMonth) {
        // 重置并增加
        memeUsage = { date: currentMonth, count: 0 };
      } else {
        // 累加
        memeUsage = {
          ...memeUsage,
          count: (memeUsage.count || 0) + (increment || 1),
          date: currentMonth,
        };
      }

      // 如果使用次数需要重置，更新数据库
      if (
        isSceneDateFormat ||
        isMemeDateFormat ||
        sceneUsage.date !== user.sceneUsage?.date ||
        memeUsage.date !== user.memeUsage?.date
      ) {
        await db
          .collection("users")
          .doc(userId)
          .update({
            data: {
              sceneUsage: sceneUsage,
              memeUsage: memeUsage,
            },
          });
      }
    } else {
      // 免费用户：按日重置
      const sceneUsageDate = normalizeDateString(sceneUsage.date);
      const memeUsageDate = normalizeDateString(memeUsage.date);

      if (sceneUsageDate !== today) {
        sceneUsage = { date: today, count: 0 };
      } else {
        sceneUsage = { ...sceneUsage, date: today };
      }

      if (memeUsageDate !== today) {
        memeUsage = { date: today, count: 0 };
      } else {
        memeUsage = { ...memeUsage, date: today };
      }
    }

    return NextResponse.json({
      success: 1,
      data: {
        userId: user._id,
        phone: user.phone,
        userTier: userTier,
        sceneUsage: sceneUsage,
        memeUsage: memeUsage,
        membershipExpiresAt: membershipExpiresAt || null,
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
    const userTier = user.userTier || "FREE";
    const membershipStartedAt = user.membershipStartedAt;
    const isPremium = ["BASIC", "STANDARD", "PREMIUM"].includes(userTier);

    if (isPremium && membershipStartedAt) {
      // 会员用户：按月计算
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}`;

      // 检查 sceneUsage.date 的格式
      const isSceneDateFormat =
        sceneUsage.date &&
        sceneUsage.date.length === 10 &&
        sceneUsage.date.includes("-");

      if (isSceneDateFormat || sceneUsage.date !== currentMonth) {
        // 重置并增加
        sceneUsage = { date: currentMonth, count: increment || 1 };
      } else {
        // 累加
        sceneUsage = {
          ...sceneUsage,
          count: (sceneUsage.count || 0) + (increment || 1),
          date: currentMonth,
        };
      }
    } else {
      // 免费用户：按日重置
      const sceneUsageDate = normalizeDateString(sceneUsage.date);

      if (sceneUsageDate !== today) {
        sceneUsage = { date: today, count: increment || 1 };
      } else {
        sceneUsage.count = (sceneUsage.count || 0) + (increment || 1);
        sceneUsage.date = today; // 确保日期格式统一
      }
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
    const userTier = user.userTier || "FREE";
    const membershipStartedAt = user.membershipStartedAt;
    const isPremium = ["BASIC", "STANDARD", "PREMIUM"].includes(userTier);

    if (isPremium && membershipStartedAt) {
      // 会员用户：按月计算
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}`;

      // 检查 memeUsage.date 的格式
      const isMemeDateFormat =
        memeUsage.date &&
        memeUsage.date.length === 10 &&
        memeUsage.date.includes("-");

      if (isMemeDateFormat || memeUsage.date !== currentMonth) {
        // 重置并增加
        memeUsage = { date: currentMonth, count: increment || 1 };
      } else {
        // 累加
        memeUsage = {
          ...memeUsage,
          count: (memeUsage.count || 0) + (increment || 1),
          date: currentMonth,
        };
      }
    } else {
      // 免费用户：按日重置
      const memeUsageDate = normalizeDateString(memeUsage.date);

      if (memeUsageDate !== today) {
        memeUsage = { date: today, count: increment || 1 };
      } else {
        memeUsage.count = (memeUsage.count || 0) + (increment || 1);
        memeUsage.date = today; // 确保日期格式统一
      }
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
  const { action, userId, type, url, prompt, style, historyId, limit, items } =
    body;

  if (action === "save") {
    if (items && Array.isArray(items)) {
      // 批量保存
      const results = [];
      for (const item of items) {
        const historyItem = {
          userId: userId || null,
          type: item.type, // 'scene' 或 'meme'
          url: item.url,
          prompt: item.prompt,
          style: item.style || null,
          timestamp: Date.now(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          const addResult = await db.collection("history").add({
            data: historyItem,
          });
          results.push({
            success: true,
            data: {
              id: addResult._id,
              userId: historyItem.userId,
              type: historyItem.type,
              url: historyItem.url,
              prompt: historyItem.prompt,
              style: historyItem.style,
              timestamp: historyItem.timestamp,
            },
            index: item.index, // 保留前端传来的 index
          });
        } catch (err: any) {
          console.error("批量保存历史记录失败:", err);
          results.push({
            success: false,
            error: err.message,
            index: item.index,
          });
        }
      }

      return NextResponse.json({
        success: 1,
        data: results, // 返回批量结果
      });
    } else {
      // 单条保存
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
    }
  } else if (action === "getList") {
    // 获取历史记录列表
    if (!userId) {
      return NextResponse.json({
        success: 0,
        message: "用户ID不能为空",
      });
    }

    const query = db
      .collection("history")
      .where({
        userId: userId,
      })
      .orderBy("timestamp", "desc")
      .limit(limit || 50);

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
    // 删除历史记录（支持批量删除）
    if (!userId) {
      return NextResponse.json({
        success: 0,
        message: "用户ID不能为空",
      });
    }

    // historyId 可以是字符串或字符串数组
    const historyIds = Array.isArray(historyId) ? historyId : [historyId];

    if (historyIds.length === 0) {
      return NextResponse.json({
        success: 0,
        message: "历史记录ID不能为空",
      });
    }

    // 验证所有历史记录是否属于该用户
    for (const id of historyIds) {
      const historyResult = await db.collection("history").doc(id).get();
      const historyItem = historyResult.data;

      if (!historyItem) {
        return NextResponse.json({
          success: 0,
          message: `历史记录 ${id} 不存在`,
        });
      }

      if (historyItem.userId !== userId) {
        return NextResponse.json({
          success: 0,
          message: `无权删除历史记录 ${id}`,
        });
      }
    }

    // 批量删除（微信云数据库不支持 batch，使用循环删除）
    for (const id of historyIds) {
      await db.collection("history").doc(id).remove();
    }

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

/**
 * 处理图片上传到云存储
 */
async function handleUploadImage(body: any) {
  try {
    const { base64Data, fileName, mimeType, images } = body;

    // 获取云实例
    const { cloud } = await getCloudDB();

    if (images && Array.isArray(images)) {
      // 批量上传
      const results = [];
      for (const img of images) {
        try {
          const {
            base64Data: imgData,
            fileName: imgName,
            mimeType: imgMime,
            index,
          } = img;

          if (!imgData) {
            results.push({ success: false, error: "图片数据为空", index });
            continue;
          }

          let cleanBase64 = imgData;
          let detectedMimeType = imgMime || "image/png";
          let fileExt = "png";

          if (imgData.includes(",")) {
            const parts = imgData.split(",");
            if (parts.length === 2) {
              const mimeMatch = parts[0].match(/data:image\/([^;]+)/);
              if (mimeMatch) {
                const mimeTypePart = mimeMatch[1].toLowerCase();
                detectedMimeType = `image/${mimeTypePart}`;
                if (mimeTypePart === "jpeg" || mimeTypePart === "jpg") {
                  fileExt = "jpg";
                } else if (mimeTypePart === "webp") {
                  fileExt = "webp";
                } else {
                  fileExt = "png";
                }
              }
              cleanBase64 = parts[1];
            }
          }

          const finalFileName =
            imgName ||
            `images/${Date.now()}-${Math.random()
              .toString(36)
              .substring(7)}.${fileExt}`;

          const imageBuffer = Buffer.from(cleanBase64, "base64");

          const uploadResult = await cloud.uploadFile({
            cloudPath: finalFileName,
            fileContent: imageBuffer,
          });

          const downloadUrls = await cloud.getTempFileURL({
            fileList: [uploadResult.fileID],
          });

          if (!downloadUrls.fileList || downloadUrls.fileList.length === 0) {
            results.push({ success: false, error: "获取文件链接失败", index });
            continue;
          }

          const fileUrl = downloadUrls.fileList[0].tempFileURL;
          results.push({
            success: true,
            data: {
              url: fileUrl,
              fileId: uploadResult.fileID,
              fileName: finalFileName,
            },
            index,
          });
        } catch (err: any) {
          console.error("单张图片上传失败:", err);
          results.push({
            success: false,
            error: err.message,
            index: img.index,
          });
        }
      }

      return NextResponse.json({
        success: 1,
        data: results,
      });
    } else {
      // 单张上传
      if (!base64Data) {
        return NextResponse.json({
          success: 0,
          message: "图片数据不能为空",
        });
      }

      // 处理 base64 数据（可能包含 data:image/xxx;base64, 前缀）
      let cleanBase64 = base64Data;
      let detectedMimeType = mimeType || "image/png";
      let fileExt = "png";

      if (base64Data.includes(",")) {
        const parts = base64Data.split(",");
        if (parts.length === 2) {
          // 提取 mimeType
          const mimeMatch = parts[0].match(/data:image\/([^;]+)/);
          if (mimeMatch) {
            const mimeTypePart = mimeMatch[1].toLowerCase();
            detectedMimeType = `image/${mimeTypePart}`;
            // 根据 mimeType 确定文件扩展名
            if (mimeTypePart === "jpeg" || mimeTypePart === "jpg") {
              fileExt = "jpg";
            } else if (mimeTypePart === "webp") {
              fileExt = "webp";
            } else {
              fileExt = "png";
            }
          }
          cleanBase64 = parts[1];
        }
      }

      // 生成文件名（如果未提供）
      const finalFileName =
        fileName ||
        `images/${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;

      // 将 base64 转换为 Buffer
      const imageBuffer = Buffer.from(cleanBase64, "base64");

      // 上传到云存储（使用 cloud.uploadFile）
      const uploadResult = await cloud.uploadFile({
        cloudPath: finalFileName,
        fileContent: imageBuffer,
      });

      // 获取文件临时链接（每次获取新的，有效期更长）
      const downloadUrls = await cloud.getTempFileURL({
        fileList: [uploadResult.fileID],
      });

      if (!downloadUrls.fileList || downloadUrls.fileList.length === 0) {
        return NextResponse.json({
          success: 0,
          message: "获取文件链接失败",
        });
      }

      const fileUrl = downloadUrls.fileList[0].tempFileURL;

      return NextResponse.json({
        success: 1,
        data: {
          url: fileUrl,
          fileId: uploadResult.fileID, // 返回 fileID，用于后续刷新链接
          fileName: finalFileName,
        },
      });
    }
  } catch (error: any) {
    console.error("上传图片失败:", error);
    return NextResponse.json(
      {
        success: 0,
        message: error.message || "上传图片失败",
      },
      { status: 500 }
    );
  }
}

/**
 * 处理获取图片临时链接
 */
async function handleGetImageUrl(body: any) {
  try {
    const { fileId } = body;

    if (!fileId) {
      return NextResponse.json({
        success: 0,
        message: "文件ID不能为空",
      });
    }

    // 获取云实例
    const { cloud } = await getCloudDB();

    // 获取文件临时链接
    const downloadUrls = await cloud.getTempFileURL({
      fileList: [fileId],
    });

    if (!downloadUrls.fileList || downloadUrls.fileList.length === 0) {
      return NextResponse.json({
        success: 0,
        message: "获取文件链接失败",
      });
    }

    const fileUrl = downloadUrls.fileList[0].tempFileURL;

    return NextResponse.json({
      success: 1,
      data: {
        url: fileUrl,
        fileId: fileId,
      },
    });
  } catch (error: any) {
    console.error("获取图片链接失败:", error);
    return NextResponse.json(
      {
        success: 0,
        message: error.message || "获取图片链接失败",
      },
      { status: 500 }
    );
  }
}

/**
 * 生成随机字符串
 */
function generateNonceStr(length = 32): string {
  return crypto.randomBytes(length).toString("hex").substring(0, length);
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
    } catch (e: any) {
      // 如果转换失败，使用原始格式
      console.warn("无法转换 RSA PRIVATE KEY 格式，使用原始格式:", e.message);
    }
  }

  return normalized;
}

/**
 * 生成微信支付 V3 API 签名
 * @param method - 请求方法（GET/POST）
 * @param url - 请求 URL（不包含域名）
 * @param timestamp - 时间戳（秒）
 * @param nonceStr - 随机字符串
 * @param body - 请求体（JSON 字符串）
 * @param privateKey - 商户私钥（PEM 格式）
 * @returns Base64 编码的签名
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
 * 调用微信支付 V3 API Native 支付接口
 */
async function callWechatV3Native(
  params: any,
  mchId: string,
  privateKey: string,
  serialNo: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = "/v3/pay/transactions/native";
    const method = "POST";
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = generateNonceStr(32);
    const body = JSON.stringify(params);

    // 生成签名
    const signature = generateWechatV3Sign(
      method,
      url,
      timestamp,
      nonceStr,
      body,
      privateKey
    );

    // 生成 Authorization header
    const authorization = generateWechatV3Auth(
      mchId,
      serialNo,
      nonceStr,
      timestamp,
      signature
    );

    const options = {
      hostname: "api.mch.weixin.qq.com",
      port: 443,
      path: url,
      method: method,
      headers: {
        Authorization: authorization,
        Accept: "application/json",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "User-Agent": "WeChatPay-APIv3-NodeJS",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(result);
          } else {
            reject(
              new Error(result.message || result.code || "微信支付接口调用失败")
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

    req.setTimeout(180000); // 3 分钟超时
    req.write(body);
    req.end();
  });
}

/**
 * 调用微信支付 V3 API H5 支付接口
 */
async function callWechatV3H5(
  params: any,
  mchId: string,
  privateKey: string,
  serialNo: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = "/v3/pay/transactions/h5";
    const method = "POST";
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = generateNonceStr(32);
    const body = JSON.stringify(params);

    // 生成签名
    const signature = generateWechatV3Sign(
      method,
      url,
      timestamp,
      nonceStr,
      body,
      privateKey
    );

    // 生成 Authorization header
    const authorization = generateWechatV3Auth(
      mchId,
      serialNo,
      nonceStr,
      timestamp,
      signature
    );

    const options = {
      hostname: "api.mch.weixin.qq.com",
      port: 443,
      path: url,
      method: method,
      headers: {
        Authorization: authorization,
        Accept: "application/json",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "User-Agent": "WeChatPay-APIv3-NodeJS",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(result);
          } else {
            reject(
              new Error(result.message || result.code || "微信支付接口调用失败")
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

    req.setTimeout(180000); // 3 分钟超时
    req.write(body);
    req.end();
  });
}

/**
 * 通过商户订单号查询微信支付订单（获取 transaction_id）
 * GET /v3/pay/transactions/out-trade-no/{out_trade_no}
 */
async function callWechatV3QueryByOutTradeNo(
  outTradeNo: string,
  mchId: string,
  privateKey: string,
  serialNo: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const baseUrl = `/v3/pay/transactions/out-trade-no/${outTradeNo}`;
    const queryParams = `mchid=${mchId}`;
    const url = `${baseUrl}?${queryParams}`; // 签名时 URL 需要包含查询参数
    const method = "GET";
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = generateNonceStr(32);
    const body = ""; // GET 请求没有 body

    // 生成签名（URL 必须包含查询参数）
    const signature = generateWechatV3Sign(
      method,
      url,
      timestamp,
      nonceStr,
      body,
      privateKey
    );

    // 生成 Authorization header
    const authorization = generateWechatV3Auth(
      mchId,
      serialNo,
      nonceStr,
      timestamp,
      signature
    );

    const options = {
      hostname: "api.mch.weixin.qq.com",
      port: 443,
      path: url, // 使用包含查询参数的完整 URL
      method: method,
      headers: {
        Authorization: authorization,
        Accept: "application/json",
        "User-Agent": "WeChatPay-APIv3-NodeJS",
      },
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
              new Error(result.message || result.code || "微信支付接口调用失败")
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

    req.setTimeout(180000); // 3 分钟超时
    req.end();
  });
}

/**
 * 通过微信支付订单号查询订单状态
 * GET /v3/pay/transactions/id/{transaction_id}
 */
async function callWechatV3QueryByTransactionId(
  transactionId: string,
  mchId: string,
  privateKey: string,
  serialNo: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const baseUrl = `/v3/pay/transactions/id/${transactionId}`;
    const queryParams = `mchid=${mchId}`;
    const url = `${baseUrl}?${queryParams}`; // 签名时 URL 需要包含查询参数
    const method = "GET";
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = generateNonceStr(32);
    const body = ""; // GET 请求没有 body

    // 生成签名（URL 必须包含查询参数）
    const signature = generateWechatV3Sign(
      method,
      url,
      timestamp,
      nonceStr,
      body,
      privateKey
    );

    // 生成 Authorization header
    const authorization = generateWechatV3Auth(
      mchId,
      serialNo,
      nonceStr,
      timestamp,
      signature
    );

    const options = {
      hostname: "api.mch.weixin.qq.com",
      port: 443,
      path: url, // 使用包含查询参数的完整 URL
      method: method,
      headers: {
        Authorization: authorization,
        Accept: "application/json",
        "User-Agent": "WeChatPay-APIv3-NodeJS",
      },
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
              new Error(result.message || result.code || "微信支付接口调用失败")
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

    req.setTimeout(180000); // 3 分钟超时
    req.end();
  });
}

/**
 * 处理 payment 云函数
 */
async function handlePayment(body: any, db: any, request?: NextRequest) {
  const {
    action,
    orderId,
    userId,
    amount,
    productName,
    productDesc,
    paymentMethod,
    status,
    redirectUrl,
    clientIp,
    deviceType,
    planId, // 会员计划ID (BASIC, STANDARD, PREMIUM)
    isFirstMonth, // 是否首月（享受6折优惠）
  } = body;

  if (action === "create") {
    // 创建支付订单
    if (!userId || !amount || !productName || !paymentMethod) {
      return NextResponse.json({
        success: 0,
        message: "缺少必要参数",
      });
    }

    // 生成订单ID
    const newOrderId = `ORDER_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    // 创建订单记录
    const orderData: any = {
      orderId: newOrderId,
      userId: userId,
      amount: amount,
      productName: productName,
      productDesc: productDesc || "",
      paymentMethod: paymentMethod,
      status: "PENDING",
      createdAt: Date.now(),
    };

    // 如果是会员计划订单，保存计划信息
    if (planId) {
      orderData.planId = planId;
      orderData.isFirstMonth = isFirstMonth || false;
      console.log(`[创建订单] 订单 ${newOrderId} 的 planId: ${planId}`);
    } else {
      console.warn(`[创建订单] 订单 ${newOrderId} 没有 planId`);
    }

    await db.collection("orders").add({ data: orderData });

    // 根据支付方式生成支付参数
    let paymentParams: any = {};

    if (paymentMethod === "WECHAT") {
      // 调用微信统一下单接口
      // 根据设备类型选择支付方式：
      // - PC 端：使用 Native 支付（扫码支付）
      // - 移动端：使用 H5 支付（MWEB）
      // - 微信内：使用 JSAPI 支付

      const WECHAT_APPID = process.env.WECHAT_APPID || "wxe8bd8fdfe51fb6d8";
      const WECHAT_MCH_ID = process.env.WECHAT_MCH_ID || "1730633244";
      const WECHAT_PRIVATE_KEY = process.env.WECHAT_PRIVATE_KEY || ""; // 商户私钥（PEM 格式），需要在环境变量中配置
      const WECHAT_SERIAL_NO = process.env.WECHAT_SERIAL_NO || ""; // 商户证书序列号，需要在环境变量中配置
      const WECHAT_NOTIFY_URL =
        process.env.WECHAT_NOTIFY_URL ||
        "https://your-domain.com/api/payment/wechat/notify";

      // 获取客户端 IP（从请求头中获取）
      const requestIp =
        clientIp ||
        request?.headers.get("x-forwarded-for")?.split(",")[0] ||
        request?.headers.get("x-real-ip") ||
        "127.0.0.1";

      // 获取 redirect_url（支付完成后跳转的地址）
      const finalRedirectUrl = redirectUrl || "https://your-domain.com/profile";

      // 检查必要的配置
      if (!WECHAT_PRIVATE_KEY || !WECHAT_SERIAL_NO) {
        return NextResponse.json(
          {
            success: 0,
            message: "微信支付配置不完整：缺少商户私钥或证书序列号",
          },
          { status: 500 }
        );
      }

      // 判断设备类型，默认为移动端
      const isPC = deviceType === "pc";

      // 构建 V3 API 订单参数
      const orderParams: any = {
        appid: WECHAT_APPID,
        mchid: WECHAT_MCH_ID,
        description: productName.substring(0, 127), // 商品描述，限制127字符
        out_trade_no: newOrderId,
        notify_url: WECHAT_NOTIFY_URL,
        amount: {
          total: amount, // 金额（分）
          currency: "CNY",
        },
        scene_info: {
          payer_client_ip: requestIp,
        },
      };

      // H5 支付需要额外的 scene_info
      if (!isPC) {
        orderParams.scene_info.h5_info = {
          type: "Wap",
          app_name: productName.substring(0, 60), // H5 支付场景名称，限制60字符
          app_url: finalRedirectUrl.split("?")[0], // H5 支付场景值，去掉查询参数
        };
      }

      try {
        let apiResult;
        if (isPC) {
          // PC 端：调用 Native 支付接口
          apiResult = await callWechatV3Native(
            orderParams,
            WECHAT_MCH_ID,
            WECHAT_PRIVATE_KEY,
            WECHAT_SERIAL_NO
          );

          // Native 支付返回 code_url（二维码链接）
          const codeUrl = apiResult.code_url;
          if (!codeUrl) {
            throw new Error("微信支付接口返回数据不完整：缺少 code_url");
          }

          // PC 端只需要返回 code_url，前端生成二维码
          paymentParams = {
            codeUrl: codeUrl,
          };
        } else {
          // 移动端：调用 H5 支付接口
          apiResult = await callWechatV3H5(
            orderParams,
            WECHAT_MCH_ID,
            WECHAT_PRIVATE_KEY,
            WECHAT_SERIAL_NO
          );

          // H5 支付返回 h5_url
          const h5Url = apiResult.h5_url;
          if (!h5Url) {
            throw new Error("微信支付接口返回数据不完整：缺少 h5_url");
          }

          // 如果 h5_url 存在，添加 redirect_url 参数（支付完成后跳转）
          let finalH5Url = h5Url;
          if (finalRedirectUrl) {
            // 检查 h5_url 是否已经包含参数
            const separator = h5Url.includes("?") ? "&" : "?";
            // 跳转到支付成功页面，带上订单ID
            const successUrl = `${finalRedirectUrl.replace(
              "/profile",
              "/payment-success"
            )}?orderId=${newOrderId}`;
            finalH5Url = `${h5Url}${separator}redirect_url=${encodeURIComponent(
              successUrl
            )}`;
          }

          // 生成调起支付的参数
          paymentParams = {
            // H5 支付地址（移动端非微信环境使用）
            mwebUrl: finalH5Url,
          };
        }

        // 订单创建完成，轮询由前端浏览器处理
        console.log(
          `[微信支付] 订单 ${newOrderId} 创建完成，前端将轮询订单状态`
        );
      } catch (error: any) {
        console.error("微信支付 V3 API 调用失败:", error);

        // 提供更详细的错误信息
        let errorMessage = error.message || "未知错误";

        // 如果是产品权限未开通的错误，提供更详细的提示
        if (
          errorMessage.includes("产品权限未开通") ||
          errorMessage.includes("权限未开通")
        ) {
          const productName = isPC ? "Native 支付（扫码支付）" : "H5 支付";
          errorMessage = `商户号该产品权限未开通。当前尝试使用 ${productName}，请前往微信支付商户平台 > 产品中心开通相应产品权限后重试。\n\n开通步骤：\n1. 登录微信支付商户平台 (https://pay.weixin.qq.com/)\n2. 进入"产品中心"\n3. 开通"${productName}"产品\n4. 等待审核通过后重试`;
        }

        return NextResponse.json(
          {
            success: 0,
            message: "创建微信支付订单失败: " + errorMessage,
          },
          { status: 500 }
        );
      }
    } else if (paymentMethod === "ALIPAY") {
      // 支付宝PC端支付（统一收单下单并支付页面接口）
      const ALIPAY_APPID = process.env.ALIPAY_APPID || "";
      const ALIPAY_PRIVATE_KEY = process.env.ALIPAY_PRIVATE_KEY || "";
      const ALIPAY_PUBLIC_KEY = process.env.ALIPAY_PUBLIC_KEY || "";
      const ALIPAY_NOTIFY_URL = process.env.ALIPAY_NOTIFY_URL;
      const ALIPAY_RETURN_URL =
        redirectUrl || "https://your-domain.com/profile";
      const ALIPAY_GATEWAY =
        process.env.ALIPAY_GATEWAY || "https://openapi.alipay.com/gateway.do";
      const ALIPAY_SIGN_TYPE = process.env.ALIPAY_SIGN_TYPE || "RSA2";

      // 检查必要的配置
      if (!ALIPAY_APPID || !ALIPAY_PRIVATE_KEY) {
        return NextResponse.json(
          {
            success: 0,
            message: "支付宝支付配置不完整：缺少 APPID 或私钥",
          },
          { status: 500 }
        );
      }

      try {
        // 处理私钥格式
        let processedPrivateKey = ALIPAY_PRIVATE_KEY.replace(/\\n/g, "\n");

        // 确保私钥格式正确
        // 如果私钥不包含 BEGIN/END 标记，尝试添加
        if (!processedPrivateKey.includes("BEGIN")) {
          // 如果只是 Base64 字符串，需要添加标记
          // 根据支付宝文档，默认使用 PKCS1 格式
          if (!processedPrivateKey.includes("PRIVATE KEY")) {
            processedPrivateKey = `-----BEGIN RSA PRIVATE KEY-----\n${processedPrivateKey}\n-----END RSA PRIVATE KEY-----`;
          }
        }

        // 处理支付宝公钥格式（如果已配置）
        let processedPublicKey = ALIPAY_PUBLIC_KEY
          ? ALIPAY_PUBLIC_KEY.replace(/\\n/g, "\n")
          : "";

        // 初始化 AlipayClient
        // 注意：支付宝 SDK 默认使用 PKCS1 格式，如果您的私钥是 PKCS8 格式，需要指定 keyType: 'PKCS8'
        // gateway 配置：SDK 需要完整的网关地址，包含 gateway.do
        // 默认值：https://openapi.alipay.com/gateway.do
        const gatewayUrl =
          ALIPAY_GATEWAY || "https://openapi.alipay.com/gateway.do";

        console.log("支付宝 SDK 初始化参数:", {
          appId: ALIPAY_APPID,
          gateway: gatewayUrl,
          signType: ALIPAY_SIGN_TYPE,
          hasPrivateKey: !!processedPrivateKey,
          hasPublicKey: !!processedPublicKey,
        });

        const alipaySdk = new AlipaySdk({
          appId: ALIPAY_APPID,
          privateKey: processedPrivateKey,
          alipayPublicKey: processedPublicKey || undefined, // 公钥可选，但建议配置用于验签
          gateway: gatewayUrl, // 完整的网关地址，包含 gateway.do
          signType: ALIPAY_SIGN_TYPE as "RSA" | "RSA2",
          // 如果私钥是 PKCS8 格式，取消下面的注释并设置为 'PKCS8'
          // keyType: 'PKCS8', // 默认是 'PKCS1'，如果您的私钥是 PKCS8 格式，请设置为 'PKCS8'
          timeout: 5000,
        });

        // 构建业务参数
        const bizContent = {
          out_trade_no: newOrderId, // 商户订单号
          product_code: "FAST_INSTANT_TRADE_PAY", // 产品码，PC 端固定值
          total_amount: (amount / 100).toFixed(2), // 订单总金额，单位为元
          subject: productName, // 订单标题
          body: productDesc || productName, // 订单描述
          timeout_express: "30m", // 订单超时时间，30分钟
        };

        // 调用统一收单下单并支付页面接口（使用 GET 方式返回 URL）
        // 参考：https://opendocs.alipay.com/open/028r8t?scene=22
        const paymentUrl = alipaySdk.pageExecute(
          "alipay.trade.page.pay",
          "GET",
          {
            bizContent,
            returnUrl: ALIPAY_RETURN_URL, // 支付完成后跳转地址
            notifyUrl: ALIPAY_NOTIFY_URL, // 异步通知地址
          }
        );

        // 调试日志
        console.log("支付宝支付 URL 生成:", {
          gateway: ALIPAY_GATEWAY,
          paymentUrl: paymentUrl?.substring(0, 200), // 只打印前200字符
          bizContent,
        });

        // 验证生成的 URL 格式
        if (!paymentUrl || !paymentUrl.includes("openapi.alipay.com")) {
          throw new Error(
            `生成的支付链接格式不正确: ${paymentUrl?.substring(0, 100)}`
          );
        }

        // 返回支付页面链接
        paymentParams = {
          paymentUrl: paymentUrl, // 支付页面链接
        };
      } catch (error: any) {
        console.error("支付宝支付接口调用失败:", error);

        // 提供更详细的错误信息
        let errorMessage = error.message || "未知错误";

        // 如果是私钥格式错误，提供更明确的提示
        if (
          errorMessage.includes("DECODER routines") ||
          errorMessage.includes("unsupported") ||
          errorMessage.includes("PEM") ||
          errorMessage.includes("key")
        ) {
          errorMessage = `私钥格式错误：${errorMessage}。请确认您配置的是应用私钥（不是公钥），并且格式正确。私钥应该以 -----BEGIN RSA PRIVATE KEY----- 或 -----BEGIN PRIVATE KEY----- 开头，通常有 1000+ 字符。如果您的私钥是 PKCS8 格式，请在代码中设置 keyType: 'PKCS8'。`;
        }

        return NextResponse.json(
          {
            success: 0,
            message: "创建支付宝支付订单失败: " + errorMessage,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: 1,
      data: {
        orderId: newOrderId,
        paymentParams: paymentParams,
      },
    });
  } else if (action === "query") {
    // 查询订单状态
    if (!orderId) {
      return NextResponse.json({
        success: 0,
        message: "订单ID不能为空",
      });
    }

    const result = await db
      .collection("orders")
      .where({ orderId: orderId })
      .get();

    if (result.data.length === 0) {
      return NextResponse.json({
        success: 0,
        message: "订单不存在",
      });
    }

    const order = result.data[0];
    return NextResponse.json({
      success: 1,
      data: {
        orderId: order.orderId,
        amount: order.amount,
        productName: order.productName,
        productDesc: order.productDesc,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: order.createdAt,
        paidAt: order.paidAt || null,
        planId: order.planId || null, // 返回会员计划ID
      },
    });
  } else if (action === "updateStatus") {
    // 更新订单状态（用于支付回调）
    if (!orderId || !status) {
      return NextResponse.json({
        success: 0,
        message: "缺少必要参数",
      });
    }

    const updateData: any = {
      status: status,
    };

    if (status === "SUCCESS") {
      updateData.paidAt = Date.now();
    }

    await db
      .collection("orders")
      .where({ orderId: orderId })
      .update({ data: updateData });

    // 如果支付成功，更新用户会员状态和到期时间
    if (status === "SUCCESS") {
      const orderResult = await db
        .collection("orders")
        .where({ orderId: orderId })
        .get();

      if (orderResult.data.length > 0) {
        const order = orderResult.data[0];
        const planId = order.planId || "STANDARD"; // 默认标准会员

        // 计算会员到期时间（从支付时间开始，1个月后）
        const paidAt = order.paidAt || Date.now();
        const membershipExpiresAt = paidAt + 30 * 24 * 60 * 60 * 1000; // 30天后

        // 计算当前月份（用于重置使用次数）
        const currentDate = new Date(paidAt);
        const currentMonth = `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}`;

        // 更新用户会员状态和到期时间，并重置使用次数
        const userUpdateData: any = {
          userTier: planId,
          membershipExpiresAt: membershipExpiresAt,
          membershipStartedAt: paidAt,
          // 重置使用次数为当月
          sceneUsage: { date: currentMonth, count: 0 },
          memeUsage: { date: currentMonth, count: 0 },
        };

        await db.collection("users").doc(order.userId).update({
          data: userUpdateData,
        });
      }
    }

    return NextResponse.json({
      success: 1,
      message: "订单状态更新成功",
    });
  } else {
    return NextResponse.json({
      success: 0,
      message: "未知操作",
    });
  }
}

/**
 * 处理资源库云函数
 */
async function handleLibrary(body: any, db: any) {
  const {
    action,
    userId,
    name,
    url,
    fileId,
    mimeType,
    fileSize,
    resourceId,
    resourceIds,
  } = body;

  if (action === "save") {
    // 保存资源
    const resourceItem = {
      userId: userId || null,
      name: name,
      url: url,
      fileId: fileId,
      mimeType: mimeType,
      fileSize: fileSize || null,
      timestamp: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const addResult = await db.collection("library").add({
      data: resourceItem,
    });

    return NextResponse.json({
      success: 1,
      data: {
        id: addResult._id,
        userId: resourceItem.userId,
        name: resourceItem.name,
        url: resourceItem.url,
        fileId: resourceItem.fileId,
        mimeType: resourceItem.mimeType,
        fileSize: resourceItem.fileSize,
        timestamp: resourceItem.timestamp,
      },
    });
  } else if (action === "getList") {
    // 获取资源列表
    let query = db.collection("library");

    // 如果提供了 userId，只获取该用户的资源；否则获取所有资源（游客模式）
    if (userId) {
      query = query.where({
        userId: userId,
      });
    } else {
      query = query.where({
        userId: null,
      });
    }

    const result = await query.orderBy("timestamp", "desc").get();

    const resources = result.data.map((item: any) => ({
      id: item._id,
      userId: item.userId,
      name: item.name,
      url: item.url,
      fileId: item.fileId,
      mimeType: item.mimeType,
      fileSize: item.fileSize,
      timestamp: item.timestamp,
    }));

    return NextResponse.json({
      success: 1,
      data: {
        resources: resources,
      },
    });
  } else if (action === "delete") {
    // 删除资源
    if (!resourceId) {
      return NextResponse.json({
        success: 0,
        message: "资源ID不能为空",
      });
    }

    // 验证资源是否属于该用户
    const resourceResult = await db.collection("library").doc(resourceId).get();
    if (!resourceResult.data) {
      return NextResponse.json({
        success: 0,
        message: "资源不存在",
      });
    }

    const resource = resourceResult.data;
    if (userId && resource.userId !== userId) {
      return NextResponse.json({
        success: 0,
        message: "无权删除该资源",
      });
    }

    await db.collection("library").doc(resourceId).remove();

    return NextResponse.json({
      success: 1,
      message: "删除成功",
    });
  } else if (action === "batchDelete") {
    // 批量删除资源
    if (
      !resourceIds ||
      !Array.isArray(resourceIds) ||
      resourceIds.length === 0
    ) {
      return NextResponse.json({
        success: 0,
        message: "资源ID列表不能为空",
      });
    }

    // 验证所有资源是否属于该用户
    for (const id of resourceIds) {
      const resourceResult = await db.collection("library").doc(id).get();
      if (resourceResult.data) {
        const resource = resourceResult.data;
        if (userId && resource.userId !== userId) {
          return NextResponse.json({
            success: 0,
            message: "无权删除某些资源",
          });
        }
      }
    }

    // 批量删除（微信云数据库不支持 batch，使用循环删除）
    for (const id of resourceIds) {
      await db.collection("library").doc(id).remove();
    }

    return NextResponse.json({
      success: 1,
      message: "批量删除成功",
    });
  } else if (action === "updateName") {
    // 更新资源名称
    if (!resourceId || !name) {
      return NextResponse.json({
        success: 0,
        message: "资源ID和名称不能为空",
      });
    }

    // 验证资源是否属于该用户
    const resourceResult = await db.collection("library").doc(resourceId).get();
    if (!resourceResult.data) {
      return NextResponse.json({
        success: 0,
        message: "资源不存在",
      });
    }

    const resource = resourceResult.data;
    if (userId && resource.userId !== userId) {
      return NextResponse.json({
        success: 0,
        message: "无权修改该资源",
      });
    }

    await db
      .collection("library")
      .doc(resourceId)
      .update({
        data: {
          name: name,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({
      success: 1,
      message: "更新成功",
    });
  } else {
    return NextResponse.json({
      success: 0,
      message: "未知操作",
    });
  }
}

/**
 * 密码哈希加盐工具函数
 * @param password 明文密码
 * @param salt 盐值
 * @returns 哈希后的密码
 */
function hashPassword(password: string, salt: string): string {
  // 使用 PBKDF2 进行密码哈希（更安全）
  const iterations = 10000; // 迭代次数
  const keylen = 64; // 输出长度
  const digest = "sha512";
  
  return crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString("hex");
}

/**
 * 生成随机盐值
 * @returns 随机盐值
 */
function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}
