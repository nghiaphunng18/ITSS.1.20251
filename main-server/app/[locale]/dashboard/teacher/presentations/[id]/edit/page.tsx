"use client";

import dynamic from "next/dynamic";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axios from "@/lib/axios";
import { Presentation, SaveCheckpointRequest } from "@/types/presentation";
import CheckpointEditorSidebar from "@/components/features/interactive-slides/CheckpointEditorSidebar";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import Link from "next/link";

const PDFMainViewer = dynamic(
  () => import("@/components/features/interactive-slides/PDFMainViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center">
        Đang tải trình đọc...
      </div>
    ),
  }
);

export default function EditPresentationPage() {
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;

  const { user } = useAuth();
  const toast = useToast();

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Load dữ liệu bài giảng
  const fetchPresentation = useCallback(async () => {
    try {
      const res = await axios.get(`/api/presentations/${id}`);
      setPresentation(res.data);
    } catch (error) {
      console.error("Failed to load presentation", error);
      toast.error("Lỗi", "Không thể tải bài giảng");
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchPresentation();
  }, [fetchPresentation]);

  // Handle lưu checkpoint
  const handleSaveCheckpoint = async (
    data: Omit<SaveCheckpointRequest, "userId">
  ) => {
    if (!user || !presentation) return;
    setIsSaving(true);

    try {
      // Gọi API lưu
      await axios.post(`/api/presentations/${presentation.id}/checkpoints`, {
        ...data,
        userId: user.id,
      });

      toast.success(
        "Thành công",
        "Đã lưu câu hỏi cho trang " + data.pageNumber
      );

      // Reload lại data để cập nhật list checkpoints
      await fetchPresentation();
    } catch (error) {
      console.error(error);
      toast.error("Thất bại", "Không thể lưu câu hỏi");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle checkpoint removal
  const handleDeleteCheckpoint = async () => {
    if (!user || !presentation) return;
    setIsSaving(true); // Tận dụng state loading

    try {
      // Gọi API DELETE với query param page và userId
      await axios.delete(
        `/api/presentations/${presentation.id}/checkpoints?page=${currPage}&userId=${user.id}`
      );

      toast.success("Đã xóa", "Câu hỏi đã được xóa khỏi trang này");

      // Reload data
      await fetchPresentation();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi", "Không thể xóa câu hỏi");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper: Tìm xem trang hiện tại có checkpoint chưa
  const currentCheckpoint = presentation?.checkpoints?.find(
    (cp) => cp.pageNumber === currPage
  );

  if (loading)
    return <div className="p-10 text-center">Đang tải trình biên tập...</div>;
  if (!presentation)
    return (
      <div className="p-10 text-center text-red-500">
        Bài giảng không tồn tại
      </div>
    );

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-100 overflow-hidden">
      {/* 1. Topbar */}
      <div className="h-14 bg-white border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/dashboard/teacher/presentations`}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-gray-800 text-sm md:text-base truncate max-w-[300px]">
              {presentation.name}
            </h1>
            <p className="text-xs text-gray-500">Chế độ biên tập</p>
          </div>
        </div>
        {/* Pagination Controls (ở giữa) */}
        <div className="flex items-center gap-4 bg-gray-50 px-3 py-1.5 rounded-lg border">
          <button
            onClick={() => setCurrPage((p) => Math.max(1, p - 1))}
            disabled={currPage <= 1}
            className="p-1 hover:text-blue-600 disabled:text-gray-300 transition"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-medium text-gray-700 min-w-20 text-center select-none">
            Trang {currPage} / {totalPages || "--"}
          </span>
          <button
            onClick={() => setCurrPage((p) => Math.min(totalPages, p + 1))}
            disabled={currPage >= totalPages}
            className="p-1 hover:text-blue-600 disabled:text-gray-300 transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="w-[30px]"></div> {/* Spacer để căn giữa pagination */}
      </div>

      {/* 2. Main Content (Split View) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: PDF Viewer */}
        <div className="flex-1 p-6 overflow-auto bg-gray-100 flex justify-center">
          <div className="w-full max-w-4xl h-full flex flex-col">
            <PDFMainViewer
              fileUrl={presentation.fileUrl}
              currPage={currPage}
              onLoadSuccess={(total) => setTotalPages(total)}
            />
          </div>
        </div>

        {/* RIGHT: Sidebar Editor */}
        <div className="w-[350px] lg:w-[400px] shrink-0 h-full">
          <CheckpointEditorSidebar
            pageNumber={currPage}
            existingCheckpoint={currentCheckpoint}
            onSave={handleSaveCheckpoint}
            onDelete={handleDeleteCheckpoint}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
