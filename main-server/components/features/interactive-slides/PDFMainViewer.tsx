"use client";

import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react"; // Import icon

// Import CSS
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
  const [scale, setScale] = useState(1.2); // Mặc định 120%
  const containerRef = useRef<HTMLDivElement>(null);

  // Xử lý Ctrl + Scroll để zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        setScale((prev) => Math.min(Math.max(0.5, prev + delta), 3.0)); // Limit 50% -> 300%
      }
    };

    // Phải add native event listener với { passive: false } để preventDefault được
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Các hàm tiện ích
  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3.0));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const resetZoom = () => setScale(1.2);

  return (
    <div className="relative h-full flex flex-col group">
      {/* Container chính */}
      <div
        ref={containerRef}
        className="flex-1 flex justify-center bg-gray-200 border rounded-lg overflow-auto shadow-inner p-4 custom-scrollbar relative"
      >
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => onLoadSuccess(numPages)}
          loading={
            <div className="flex items-center justify-center h-96 text-gray-500 gap-2">
              <span className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
              <span className="animate-pulse">Đang tải tài liệu...</span>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center h-96 text-red-500 gap-2 p-4 text-center">
              <p className="font-medium">⚠ Không thể tải file PDF</p>
              <p className="text-sm text-gray-500">
                Vui lòng kiểm tra lại đường dẫn hoặc định dạng file.
              </p>
            </div>
          }
          className="shadow-lg"
        >
          <Page
            pageNumber={currPage}
            scale={scale} // Truyền scale vào đây
            renderAnnotationLayer={false}
            renderTextLayer={false}
            className="bg-white transition-transform duration-200 ease-in-out" // Thêm transition cho mượt
            loading={
              <div
                className="bg-white animate-pulse"
                style={{
                  width: `${600 * scale}px`,
                  height: `${800 * scale}px`,
                }}
              />
            }
          />
        </Document>
      </div>

      {/* Floating Toolbar (Thanh công cụ nổi) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/75 backdrop-blur-sm text-white px-3 py-2 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={zoomOut}
          className="p-1.5 hover:bg-white/20 rounded-full transition"
          title="Thu nhỏ (Ctrl -)"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-xs font-medium w-12 text-center select-none">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={zoomIn}
          className="p-1.5 hover:bg-white/20 rounded-full transition"
          title="Phóng to (Ctrl +)"
        >
          <ZoomIn size={18} />
        </button>
        <div className="w-px h-4 bg-white/20 mx-1"></div>
        <button
          onClick={resetZoom}
          className="p-1.5 hover:bg-white/20 rounded-full transition"
          title="Đặt lại (Reset)"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
}
