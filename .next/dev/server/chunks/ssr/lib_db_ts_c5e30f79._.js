module.exports = [
"[project]/lib/db.ts [app-rsc] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/efaf5_wx-server-sdk_index_e7c009d0.js",
  "server/chunks/ssr/lib_f7956df6._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/db.ts [app-rsc] (ecmascript)");
    });
});
}),
];