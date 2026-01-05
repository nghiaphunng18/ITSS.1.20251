module.exports = [
"[project]/i18n/messages/ja.json (json, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/i18n_messages_ja_json_2440d374._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/i18n/messages/ja.json (json)");
    });
});
}),
"[project]/i18n/messages/vi.json (json, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/i18n_messages_vi_json_498100e5._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/i18n/messages/vi.json (json)");
    });
});
}),
];