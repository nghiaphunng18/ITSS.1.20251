"use client";

import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

interface Props {
  fileUrl: string;
  currPage: number;
  onLoadSuccess: (total: number) => void;
}

export default function PDFMainViewer({
  fileUrl,
  currPage,
  onLoadSuccess,
}: Props) {
  const t = useTranslations("pdf_main_viewer");
  const [scale, setScale] = useState(1.2);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        setScale((prev) => Math.min(Math.max(0.5, prev + delta), 3.0));
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3.0));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const resetZoom = () => setScale(1.2);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="relative h-full flex flex-col group">
      {/* PDF Header Info */}
      <div className="px-4 py-3 border-b border-mint-100 bg-linear-to-r from-white to-mint-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-mint-100 rounded-lg">
            <Sparkles className="w-4 h-4 text-mint-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {t("header.current_page", { page: currPage })}
            </p>
            <p className="text-xs text-gray-500">{t("header.hint")}</p>
          </div>
        </div>
      </div>

      {/* Container chính */}
      <div
        ref={containerRef}
        className="flex-1 flex justify-center bg-linear-to-br from-mint-25 to-white overflow-auto p-4 relative"
      >
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => onLoadSuccess(numPages)}
          loading={
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin"></div>
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-emerald-500 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="font-medium text-mint-700">
                  {t("loading.title")}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {t("loading.description")}
                </p>
              </div>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
              <div className="p-4 bg-red-50 rounded-2xl">
                <Sparkles className="w-12 h-12 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  {t("error.title")}
                </p>
                <p className="text-gray-500 mt-2 max-w-sm">
                  {t("error.description")}
                </p>
              </div>
            </div>
          }
        >
          <Page
            pageNumber={currPage}
            scale={scale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            className="bg-white shadow-xl rounded-lg transition-transform duration-300 ease-out"
            loading={
              <div
                className="bg-linear-to-br from-white to-mint-50 rounded-lg animate-pulse border border-mint-100"
                style={{
                  width: `${600 * scale}px`,
                  height: `${800 * scale}px`,
                }}
              />
            }
          />
        </Document>
      </div>

      {/* Floating Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-linear-to-r from-mint-500/90 to-emerald-500/90 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
        <button
          onClick={zoomOut}
          className="p-2 hover:bg-white/20 rounded-lg transition-all hover:scale-110 active:scale-95"
          title={t("toolbar.zoom_out")}
        >
          <ZoomOut size={20} />
        </button>

        <div className="flex flex-col items-center px-3">
          <span className="text-sm font-bold">
            {t("toolbar.percentage", { percent: Math.round(scale * 100) })}
          </span>
          <div className="w-16 h-1.5 bg-white/30 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((scale - 0.5) / 2.5) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={zoomIn}
          className="p-2 hover:bg-white/20 rounded-lg transition-all hover:scale-110 active:scale-95"
          title={t("toolbar.zoom_in")}
        >
          <ZoomIn size={20} />
        </button>

        <div className="w-px h-6 bg-white/30 mx-1"></div>

        <button
          onClick={resetZoom}
          className="p-2 hover:bg-white/20 rounded-lg transition-all hover:scale-110 active:scale-95"
          title={t("toolbar.reset_zoom")}
        >
          <RefreshCw size={18} />
        </button>

        <div className="w-px h-6 bg-white/30 mx-1"></div>

        <button
          onClick={toggleFullscreen}
          className="p-2 hover:bg-white/20 rounded-lg transition-all hover:scale-110 active:scale-95"
          title={
            isFullscreen
              ? t("toolbar.exit_fullscreen")
              : t("toolbar.enter_fullscreen")
          }
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
    </div>
  );
}
