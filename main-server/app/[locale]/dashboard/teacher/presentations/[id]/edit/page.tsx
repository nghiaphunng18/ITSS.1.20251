"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axios from "@/lib/axios";
import { Presentation, SaveCheckpointRequest } from "@/types/presentation";
import CheckpointEditorSidebar from "@/components/features/interactive-slides/CheckpointEditorSidebar";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Edit,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const PDFMainViewer = dynamic(
  () => import("@/components/features/interactive-slides/PDFMainViewer"),
  {
    ssr: false,
    loading: () => null,
  }
);

function PDFLoading({ text }: { text: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin"></div>
        <p className="text-mint-600 font-medium">{text}</p>
      </div>
    </div>
  );
}

export default function EditPresentationPage() {
  const params = useParams();
  const id = params?.id as string;
  const t = useTranslations("edit_presentation_page");
  const locale = useLocale();

  const { user } = useAuth();
  const toast = useToast();

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPresentation = useCallback(async () => {
    try {
      const res = await axios.get(`/api/presentations/${id}`);
      setPresentation(res.data);
    } catch (error) {
      console.error("Failed to load presentation", error);
      toast.error(
        t("toast.error_loading_title"),
        t("toast.error_loading_message")
      );
    } finally {
      setLoading(false);
    }
  }, [id, toast, t]);

  useEffect(() => {
    fetchPresentation();
  }, [fetchPresentation]);

  const handleSaveCheckpoint = async (
    data: Omit<SaveCheckpointRequest, "userId">
  ) => {
    if (!user || !presentation) return;
    setIsSaving(true);

    try {
      await axios.post(`/api/presentations/${presentation.id}/checkpoints`, {
        ...data,
        userId: user.id,
      });

      toast.success(
        t("toast.success_save_title"),
        t("toast.success_save_message", { pageNumber: data.pageNumber })
      );

      await fetchPresentation();
    } catch (error) {
      console.error(error);
      toast.error(t("toast.error_save_title"), t("toast.error_save_message"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCheckpoint = async () => {
    if (!user || !presentation) return;
    setIsSaving(true);

    try {
      await axios.delete(
        `/api/presentations/${presentation.id}/checkpoints?page=${currPage}&userId=${user.id}`
      );

      toast.success(
        t("toast.success_delete_title"),
        t("toast.success_delete_message")
      );

      await fetchPresentation();
    } catch (error) {
      console.error(error);
      toast.error(
        t("toast.error_delete_title"),
        t("toast.error_delete_message")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const currentCheckpoint = presentation?.checkpoints?.find(
    (cp) => cp.pageNumber === currPage
  );

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-linear-to-b from-white to-mint-25">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin"></div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-emerald-500 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-mint-700 font-semibold text-lg">
              {t("loading.loading_presentation")}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {t("loading.preparing_editor")}
            </p>
          </div>
        </div>
      </div>
    );

  if (!presentation)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-linear-to-b from-white to-mint-25">
        <div className="text-center p-8 bg-white rounded-2xl border border-mint-100 shadow-lg max-w-md">
          <div className="p-4 bg-red-50 rounded-full w-16 h-16 mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-400 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t("error.title")}
          </h3>
          <p className="text-gray-500 mb-6">{t("error.description")}</p>
          <Link
            href={`/${locale}/dashboard/teacher/presentations`}
            className="inline-flex items-center gap-2 text-mint-600 hover:text-emerald-600 font-medium"
          >
            <ArrowLeft size={18} />
            {t("error.back_to_library")}
          </Link>
        </div>
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-white to-mint-25 overflow-hidden">
      {/* 1. Topbar với gradient */}
      <div className="h-16 bg-linear-to-r from-white to-mint-50 border-b border-mint-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/dashboard/teacher/presentations`}
            className="p-2 hover:bg-mint-100 rounded-xl text-gray-600 hover:text-mint-700 transition-colors group"
            title={t("navigation.back_to_library_title")}
          >
            <ArrowLeft
              size={22}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-linear-to-br from-mint-500 to-emerald-500 rounded-xl shadow">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base md:text-lg truncate max-w-[300px] md:max-w-[400px]">
                {presentation.name}
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                {t("header.edit_mode")}
              </p>
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-4 bg-white px-4 py-2.5 rounded-xl border border-mint-200 shadow-sm">
          <button
            onClick={() => setCurrPage((p) => Math.max(1, p - 1))}
            disabled={currPage <= 1}
            className="p-2 hover:bg-mint-50 rounded-lg text-gray-500 hover:text-mint-600 disabled:text-gray-300 transition-all disabled:cursor-not-allowed"
            title={t("header.previous_page")}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex flex-col items-center min-w-28">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-lg">
                {currPage}
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 font-medium">
                {totalPages || "--"}
              </span>
            </div>
            <div className="w-20 bg-mint-200 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-linear-to-r from-mint-500 to-emerald-500 transition-all duration-300"
                style={{
                  width: totalPages
                    ? `${(currPage / totalPages) * 100}%`
                    : "0%",
                }}
              />
            </div>
          </div>

          <button
            onClick={() => setCurrPage((p) => Math.min(totalPages, p + 1))}
            disabled={currPage >= totalPages}
            className="p-2 hover:bg-mint-50 rounded-lg text-gray-500 hover:text-mint-600 disabled:text-gray-300 transition-all disabled:cursor-not-allowed"
            title={t("header.next_page")}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {currentCheckpoint && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200">
              <Sparkles className="w-3 h-3" />
              {t("header.has_checkpoint")}
            </div>
          )}
          <div className="w-[30px]"></div>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: PDF Viewer */}
        <div className="flex-1 p-4 lg:p-6 overflow-hidden bg-linear-to-b from-mint-25 to-white">
          <div className="w-full h-full flex justify-center">
            <div className="w-full max-w-5xl h-full flex flex-col rounded-2xl overflow-hidden border border-mint-200 bg-white shadow-lg">
              <Suspense
                fallback={<PDFLoading text={t("loading.loading_pdf")} />}
              >
                <PDFMainViewer
                  fileUrl={presentation.fileUrl}
                  currPage={currPage}
                  onLoadSuccess={(total) => setTotalPages(total)}
                />
              </Suspense>
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar Editor */}
        <div className="w-full lg:w-[420px] shrink-0 h-full border-l border-mint-200 bg-white shadow-lg">
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
