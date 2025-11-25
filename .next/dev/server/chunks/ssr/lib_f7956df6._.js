module.exports = [
"[project]/lib/date-utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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

//# sourceMappingURL=lib_f7956df6._.js.map