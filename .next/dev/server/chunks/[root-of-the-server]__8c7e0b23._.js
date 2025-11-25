module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/date-utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 日期工具函数
 * 统一日期格式，避免不同环境下的格式差异
 */ /**
 * 获取今天的日期字符串（格式：YYYY-MM-DD）
 */ __turbopack_context__.s([
    "getTodayDateString",
    ()=>getTodayDateString,
    "normalizeDateString",
    ()=>normalizeDateString
]);
function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function normalizeDateString(date) {
    if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    // 如果是字符串，尝试解析
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    // 如果已经是 YYYY-MM-DD 格式，直接返回
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
    }
    // 尝试解析其他格式（如 M/D/YYYY 或 YYYY/M/D）
    const parts = date.split(/[\/\-]/);
    if (parts.length === 3) {
        let year, month, day;
        // 判断格式：如果第一部分是4位数，则是 YYYY/M/D
        if (parts[0].length === 4) {
            year = parts[0];
            month = parts[1].padStart(2, '0');
            day = parts[2].padStart(2, '0');
        } else {
            // 否则是 M/D/YYYY
            month = parts[0].padStart(2, '0');
            day = parts[1].padStart(2, '0');
            year = parts[2];
        }
        return `${year}-${month}-${day}`;
    }
    // 如果无法解析，返回原字符串
    return date;
}
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 数据库操作共享函数
 * 供 SSR 和 API 路由使用
 */ __turbopack_context__.s([
    "getCloudDB",
    ()=>getCloudDB,
    "getUserInfoFromDB",
    ()=>getUserInfoFromDB
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-route] (ecmascript)");
;
// 动态导入 wx-server-sdk（CommonJS 模块）
let cloudInstance;
let dbInstance;
async function getCloudDB() {
    if (!cloudInstance) {
        // 使用动态导入处理 CommonJS 模块
        const wxServerSDK = await __turbopack_context__.A("[project]/node_modules/.pnpm/wx-server-sdk@3.0.1/node_modules/wx-server-sdk/index.js [app-route] (ecmascript, async loader)");
        cloudInstance = wxServerSDK.default || wxServerSDK;
        // 配置云开发（需要 secretId 和 secretKey）
        const initConfig = {
            env: "cloudbase-5gqcz0ab010d3288"
        };
        // 从环境变量获取腾讯云凭证（如果配置了）
        const secretId = process.env.TENCENT_CLOUD_SECRET_ID;
        const secretKey = process.env.TENCENT_CLOUD_SECRET_KEY;
        if (secretId && secretKey) {
            initConfig.secretId = secretId;
            initConfig.secretKey = secretKey;
        }
        cloudInstance.init(initConfig);
        dbInstance = cloudInstance.database();
    }
    return {
        cloud: cloudInstance,
        db: dbInstance
    };
}
async function getUserInfoFromDB(userId) {
    try {
        const { db } = await getCloudDB();
        const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTodayDateString"])();
        const result = await db.collection("users").doc(userId).get();
        if (!result.data) {
            return null;
        }
        const user = result.data;
        // 检查是否需要重置每日使用量
        let sceneUsage = user.sceneUsage || {
            date: today,
            count: 0
        };
        let memeUsage = user.memeUsage || {
            date: today,
            count: 0
        };
        // 统一日期格式后比较
        const sceneUsageDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeDateString"])(sceneUsage.date);
        const memeUsageDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeDateString"])(memeUsage.date);
        if (sceneUsageDate !== today) {
            sceneUsage = {
                date: today,
                count: 0
            };
        } else {
            // 确保日期格式统一
            sceneUsage = {
                ...sceneUsage,
                date: today
            };
        }
        if (memeUsageDate !== today) {
            memeUsage = {
                date: today,
                count: 0
            };
        } else {
            // 确保日期格式统一
            memeUsage = {
                ...memeUsage,
                date: today
            };
        }
        return {
            userId: user._id,
            phone: user.phone,
            userTier: user.userTier || "FREE",
            sceneUsage: sceneUsage,
            memeUsage: memeUsage
        };
    } catch (error) {
        console.error("Get user info from DB error:", error);
        return null;
    }
}
}),
"[project]/app/api/cloud/[functionName]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-route] (ecmascript)");
;
;
;
async function POST(request, { params }) {
    try {
        // 初始化云开发并获取数据库实例
        const { db } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCloudDB"])();
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
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: 0,
                message: "未知的云函数"
            }, {
                status: 400
            });
        }
    } catch (error) {
        console.error("调用云函数失败:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 0,
            message: error.message || "调用云函数失败"
        }, {
            status: 500
        });
    }
}
/**
 * 处理 auth 云函数
 */ async function handleAuth(body, db) {
    const { action, phone, password } = body;
    if (action === "login") {
        // 登录即注册：先查找用户，不存在则创建
        const result = await db.collection("users").where({
            phone: phone
        }).get();
        let user;
        if (result.data.length === 0) {
            // 用户不存在，自动创建新用户
            const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTodayDateString"])();
            const newUser = {
                phone: phone,
                password: password,
                userTier: "FREE",
                sceneUsage: {
                    date: today,
                    count: 0
                },
                memeUsage: {
                    date: today,
                    count: 0
                },
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const addResult = await db.collection("users").add({
                data: newUser
            });
            user = {
                _id: addResult._id,
                ...newUser
            };
        } else {
            // 用户存在，验证密码
            user = result.data[0];
            if (user.password !== password) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: 0,
                    message: "密码错误"
                });
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 1,
            data: {
                userId: user._id,
                phone: user.phone,
                userTier: user.userTier || "FREE",
                sceneUsage: user.sceneUsage || {
                    date: new Date().toLocaleDateString(),
                    count: 0
                },
                memeUsage: user.memeUsage || {
                    date: new Date().toLocaleDateString(),
                    count: 0
                }
            }
        });
    } else if (action === "register") {
        // 注册
        // 检查手机号是否已存在
        const existResult = await db.collection("users").where({
            phone: phone
        }).get();
        if (existResult.data.length > 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: 0,
                message: "该手机号已注册"
            });
        }
        // 创建新用户
        const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTodayDateString"])();
        const newUser = {
            phone: phone,
            password: password,
            userTier: "FREE",
            sceneUsage: {
                date: today,
                count: 0
            },
            memeUsage: {
                date: today,
                count: 0
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const addResult = await db.collection("users").add({
            data: newUser
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 1,
            data: {
                userId: addResult._id,
                phone: newUser.phone,
                userTier: newUser.userTier,
                sceneUsage: newUser.sceneUsage,
                memeUsage: newUser.memeUsage
            }
        });
    } else {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 0,
            message: "未知操作"
        });
    }
}
/**
 * 处理 user 云函数
 */ async function handleUser(body, db) {
    const { action, userId, increment, userTier } = body;
    if (!userId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 0,
            message: "用户ID不能为空"
        });
    }
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTodayDateString"])();
    if (action === "getInfo") {
        // 获取用户信息
        const result = await db.collection("users").doc(userId).get();
        if (!result.data) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: 0,
                message: "用户不存在"
            });
        }
        const user = result.data;
        // 检查是否需要重置每日使用量
        let sceneUsage = user.sceneUsage || {
            date: today,
            count: 0
        };
        let memeUsage = user.memeUsage || {
            date: today,
            count: 0
        };
        // 统一日期格式后比较
        const sceneUsageDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeDateString"])(sceneUsage.date);
        const memeUsageDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeDateString"])(memeUsage.date);
        if (sceneUsageDate !== today) {
            sceneUsage = {
                date: today,
                count: 0
            };
        } else {
            // 确保日期格式统一
            sceneUsage = {
                ...sceneUsage,
                date: today
            };
        }
        if (memeUsageDate !== today) {
            memeUsage = {
                date: today,
                count: 0
            };
        } else {
            // 确保日期格式统一
            memeUsage = {
                ...memeUsage,
                date: today
            };
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 1,
            data: {
                userId: user._id,
                phone: user.phone,
                userTier: user.userTier || "FREE",
                sceneUsage: sceneUsage,
                memeUsage: memeUsage
            }
        });
    } else if (action === "updateSceneUsage") {
        // 更新场景扩展使用次数
        const userResult = await db.collection("users").doc(userId).get();
        if (!userResult.data) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: 0,
                message: "用户不存在"
            });
        }
        const user = userResult.data;
        let sceneUsage = user.sceneUsage || {
            date: today,
            count: 0
        };
        // 统一日期格式后比较
        const sceneUsageDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeDateString"])(sceneUsage.date);
        // 如果日期不同，重置计数
        if (sceneUsageDate !== today) {
            sceneUsage = {
                date: today,
                count: increment || 1
            };
        } else {
            sceneUsage.count = (sceneUsage.count || 0) + (increment || 1);
            sceneUsage.date = today; // 确保日期格式统一
        }
        await db.collection("users").doc(userId).update({
            data: {
                sceneUsage: sceneUsage,
                updatedAt: new Date()
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 1,
            data: {
                sceneUsage: sceneUsage
            }
        });
    } else if (action === "updateMemeUsage") {
        // 更新表情包制作使用次数
        const userResult = await db.collection("users").doc(userId).get();
        if (!userResult.data) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: 0,
                message: "用户不存在"
            });
        }
        const user = userResult.data;
        let memeUsage = user.memeUsage || {
            date: today,
            count: 0
        };
        // 统一日期格式后比较
        const memeUsageDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeDateString"])(memeUsage.date);
        // 如果日期不同，重置计数
        if (memeUsageDate !== today) {
            memeUsage = {
                date: today,
                count: increment || 1
            };
        } else {
            memeUsage.count = (memeUsage.count || 0) + (increment || 1);
            memeUsage.date = today; // 确保日期格式统一
        }
        await db.collection("users").doc(userId).update({
            data: {
                memeUsage: memeUsage,
                updatedAt: new Date()
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 1,
            data: {
                memeUsage: memeUsage
            }
        });
    } else if (action === "updateTier") {
        // 更新用户会员等级
        await db.collection("users").doc(userId).update({
            data: {
                userTier: userTier,
                updatedAt: new Date()
            }
        });
        const userResult = await db.collection("users").doc(userId).get();
        const user = userResult.data;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 1,
            data: {
                userId: user._id,
                phone: user.phone,
                userTier: user.userTier,
                sceneUsage: user.sceneUsage || {
                    date: today,
                    count: 0
                },
                memeUsage: user.memeUsage || {
                    date: today,
                    count: 0
                }
            }
        });
    } else {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 0,
            message: "未知操作"
        });
    }
}
/**
 * 处理 history 云函数
 */ async function handleHistory(body, db) {
    const { action, userId, type, url, prompt, style, historyId, limit } = body;
    if (action === "save") {
        // 保存历史记录
        const historyItem = {
            userId: userId || null,
            type: type,
            url: url,
            prompt: prompt,
            style: style || null,
            timestamp: Date.now(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const addResult = await db.collection("history").add({
            data: historyItem
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 1,
            data: {
                id: addResult._id,
                userId: historyItem.userId,
                type: historyItem.type,
                url: historyItem.url,
                prompt: historyItem.prompt,
                style: historyItem.style,
                timestamp: historyItem.timestamp
            }
        });
    } else if (action === "getList") {
        // 获取历史记录列表
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: 0,
                message: "用户ID不能为空"
            });
        }
        const query = db.collection("history").where({
            userId: userId
        }).orderBy("timestamp", "desc").limit(limit || 50);
        const result = await query.get();
        const historyList = result.data.map((item)=>({
                id: item._id,
                userId: item.userId,
                type: item.type,
                url: item.url,
                prompt: item.prompt,
                style: item.style,
                timestamp: item.timestamp
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 1,
            data: historyList
        });
    } else if (action === "delete") {
        // 删除历史记录
        if (!userId || !historyId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: 0,
                message: "用户ID和历史记录ID不能为空"
            });
        }
        // 验证历史记录是否属于该用户
        const historyResult = await db.collection("history").doc(historyId).get();
        const historyItem = historyResult.data;
        if (!historyItem) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: 0,
                message: "历史记录不存在"
            });
        }
        if (historyItem.userId !== userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: 0,
                message: "无权删除该历史记录"
            });
        }
        await db.collection("history").doc(historyId).remove();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 1,
            message: "删除成功"
        });
    } else {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: 0,
            message: "未知操作"
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8c7e0b23._.js.map