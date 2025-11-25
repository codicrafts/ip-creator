module.exports = [
"[project]/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-rsc] (ecmascript)");
;
// 动态导入 wx-server-sdk（CommonJS 模块）
let cloudInstance;
let dbInstance;
async function getCloudDB() {
    if (!cloudInstance) {
        // 使用动态导入处理 CommonJS 模块
        const wxServerSDK = await __turbopack_context__.A("[project]/node_modules/.pnpm/wx-server-sdk@3.0.1/node_modules/wx-server-sdk/index.js [app-rsc] (ecmascript, async loader)");
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
        const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTodayDateString"])();
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
        const sceneUsageDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeDateString"])(sceneUsage.date);
        const memeUsageDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeDateString"])(memeUsage.date);
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
];

//# sourceMappingURL=lib_db_ts_f1cbcace._.js.map