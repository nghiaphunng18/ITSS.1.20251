(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/features/interactive-slides/PDFMainViewer.client.tsx [app-client] (ecmascript, next/dynamic entry, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "static/chunks/node_modules_c5620fd5._.js",
  "static/chunks/components_features_interactive-slides_PDFMainViewer_client_tsx_86be500b._.js",
  {
    "path": "static/chunks/node_modules_react-pdf_dist_Page_68a5a099._.css",
    "included": [
      "[project]/node_modules/react-pdf/dist/Page/AnnotationLayer.css [app-client] (css)",
      "[project]/node_modules/react-pdf/dist/Page/TextLayer.css [app-client] (css)"
    ],
    "moduleChunks": [
      "static/chunks/node_modules_react-pdf_dist_Page_AnnotationLayer_css_bad6b30c._.single.css",
      "static/chunks/node_modules_react-pdf_dist_Page_TextLayer_css_bad6b30c._.single.css"
    ]
  },
  "static/chunks/components_features_interactive-slides_PDFMainViewer_client_tsx_9addca6d._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/components/features/interactive-slides/PDFMainViewer.client.tsx [app-client] (ecmascript, next/dynamic entry)");
    });
});
}),
]);