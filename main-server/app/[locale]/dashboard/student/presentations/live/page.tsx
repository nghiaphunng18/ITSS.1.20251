/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axios from "@/lib/axios";
import { io, Socket } from "socket.io-client";
import { CheckpointData } from "@/types/presentation";
import {
  X,
  Send,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Zap,
  Clock,
  BookOpen,
  Sparkles,
  Target,
  Hourglass,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useTranslations } from "next-intl";

const PDFMainViewer = dynamic(
  () => import("@/components/features/interactive-slides/PDFMainViewer"),
  {
    ssr: false,
    loading: () => null,
  }
);

function PDFLoading({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin"></div>
        <p className="text-mint-600 font-medium">{text}</p>
      </div>
    </div>
  );
}

export default function StudentLivePage() {
  const t = useTranslations("student_live_page");
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("sessionId");
  const { user } = useAuth();
  const toast = useToast();

  const [sessionData, setSessionData] = useState<any>(null);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const socketRef = useRef<Socket | null>(null);

  const [activeCheckpoint, setActiveCheckpoint] =
    useState<CheckpointData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State thời gian
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0); // State mới để lưu tổng thời gian câu hỏi (dùng tính %)
  const [deadline, setDeadline] = useState<number>(0);

  // 1. Load Session Info
  useEffect(() => {
    if (!sessionId) return;
    axios
      .get(`/api/sessions/${sessionId}`)
      .then((res) => setSessionData(res.data))
      .catch(() => {
        alert(t("loading.session_not_found"));
        router.back();
      });
  }, [sessionId, router, t]);

  // 2. Logic Đếm Ngược (Vẫn giữ để xử lý logic Hết Giờ, nhưng không hiển thị số)
  useEffect(() => {
    if (!activeCheckpoint || deadline === 0) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const secondsLeft = Math.ceil((deadline - now) / 1000);

      if (secondsLeft <= 0) {
        setTimeLeft(0);
        clearInterval(timer);
        return;
      }
      setTimeLeft(secondsLeft);
    }, 200);

    return () => clearInterval(timer);
  }, [activeCheckpoint, deadline]);

  // 3. Socket Connection
  useEffect(() => {
    if (!user || !sessionId) return;
    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Student connected");
      socket.emit("JOIN_SESSION", {
        sessionId,
        userId: user.id,
        role: "STUDENT",
      });
    });

    // A. Nhận lệnh MỞ câu hỏi
    socket.on("NEW_CHECKPOINT_STARTED", (data: any) => {
      const checkpoint = data.checkpoint || data;
      const duration = checkpoint.timeLimit || 30;

      // Fallback deadline nếu server chưa gửi
      const dl = data.deadline || Date.now() + duration * 1000;

      setActiveCheckpoint(checkpoint);
      setDeadline(dl);
      setTotalTime(duration); // Lưu tổng thời gian

      // Tính toán ngay lập tức
      const initialSeconds = Math.ceil((dl - Date.now()) / 1000);
      setTimeLeft(initialSeconds > 0 ? initialSeconds : 0);

      setCurrPage(checkpoint.pageNumber);
      setSelectedAnswers([]);
      setIsSubmitted(false);
      toast.info(
        t("question_popup.toast.new_question_title"),
        t("question_popup.toast.new_question_message", {
          page: checkpoint.pageNumber,
        })
      );
    });

    // B. Sync (Vào muộn / F5)
    socket.on("SYNC_CURRENT_CHECKPOINT", (data: any) => {
      const checkpoint = data.checkpoint || data;
      const duration = checkpoint.timeLimit || 30;
      const dl = data.deadline || Date.now() + duration * 1000;

      setActiveCheckpoint(checkpoint);
      setDeadline(dl);
      setTotalTime(duration);

      const initialSeconds = Math.ceil((dl - Date.now()) / 1000);
      setTimeLeft(initialSeconds > 0 ? initialSeconds : 0);
    });

    // C. Dừng câu hỏi
    socket.on("CHECKPOINT_STOPPED", () => {
      setActiveCheckpoint(null);
      setDeadline(0);
      setTotalTime(0);
      toast.info(
        t("question_popup.toast.question_closed_title"),
        t("question_popup.toast.question_closed_message")
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId, user, toast, t]);

  const toggleAnswer = (optionId: string) => {
    if (isSubmitted || timeLeft === 0) return;
    setSelectedAnswers((prev) => {
      if (prev.includes(optionId)) return prev.filter((id) => id !== optionId);
      return [...prev, optionId];
    });
  };

  const handleSubmit = async () => {
    if (!socketRef.current || !activeCheckpoint || selectedAnswers.length === 0)
      return;

    try {
      socketRef.current.emit("STUDENT_SUBMIT_ANSWER", {
        sessionId,
        checkpointId: activeCheckpoint.id,
        answerData: selectedAnswers,
      });

      await axios.post(`/api/sessions/${sessionId}/submit`, {
        userId: user?.id,
        checkpointId: activeCheckpoint.id,
        answerData: selectedAnswers,
      });

      setIsSubmitted(true);
      toast.success(
        t("question_popup.toast.submit_success_title"),
        t("question_popup.toast.submit_success_message")
      );
    } catch (error) {
      console.error(error);
      toast.error(
        t("question_popup.toast.submit_error_title"),
        t("question_popup.toast.submit_error_message")
      );
    }
  };

  if (!sessionData)
    return (
      <div className="h-screen flex items-center justify-center bg-linear-to-br from-white to-mint-25">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin"></div>
            <Zap className="absolute -top-2 -right-2 w-6 h-6 text-emerald-500 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-mint-700 font-semibold text-lg">
              {t("loading.loading_session")}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {t("loading.please_wait")}
            </p>
          </div>
        </div>
      </div>
    );

  const progressPercent = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  const progressColor =
    progressPercent > 50
      ? "from-emerald-500 to-green-500"
      : progressPercent > 20
      ? "from-amber-500 to-yellow-500"
      : "from-red-500 to-rose-500";

  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-white via-mint-25 to-emerald-25 overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-linear-to-r from-white to-mint-50 border-b border-mint-200 flex items-center px-6 justify-between shrink-0 z-10 shadow-lg shadow-mint-100/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-linear-to-br from-mint-500 to-emerald-500 rounded-xl shadow">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 truncate max-w-[250px] md:max-w-md text-sm md:text-base">
              {sessionData.presentation.name}
            </h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Target className="w-3 h-3 text-mint-500" />
              <span>{t("header.student_mode")}</span>
            </p>
          </div>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-2 bg-linear-to-br from-white to-gray-50 px-3 py-2 rounded-xl border border-mint-200 shadow-lg shadow-mint-100/20">
          <button
            onClick={() => setCurrPage((p) => Math.max(1, p - 1))}
            disabled={currPage <= 1}
            className="p-1.5 hover:bg-mint-100 rounded-lg text-gray-600 hover:text-mint-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            title={t("page_navigation.previous")}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col items-center min-w-20">
            <span className="font-bold text-gray-900 text-sm">
              {t("page_navigation.page", { current: currPage })}
            </span>
            <div className="w-16 h-1 bg-mint-100 rounded-full overflow-hidden mt-1">
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
            className="p-1.5 hover:bg-mint-100 rounded-lg text-gray-600 hover:text-mint-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            title={t("page_navigation.next")}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* PDF Viewer */}
        <div className="h-full w-full overflow-auto flex justify-center p-6">
          <div className="max-w-5xl w-full h-full rounded-2xl overflow-hidden border border-mint-200 shadow-2xl bg-white">
            <Suspense fallback={<PDFLoading text={t("loading.loading_pdf")} />}>
              <PDFMainViewer
                fileUrl={sessionData.presentation.fileUrl}
                currPage={currPage}
                onLoadSuccess={(total) => setTotalPages(total)}
              />
            </Suspense>
          </div>
        </div>

        {/* Popup Câu hỏi */}
        {activeCheckpoint && (
          <div className="absolute top-6 right-6 w-[380px] bg-linear-to-br from-white to-mint-50 rounded-2xl shadow-2xl shadow-emerald-400/20 border-2 border-mint-300 flex flex-col animate-in slide-in-from-right duration-300 max-h-[calc(100vh-120px)] overflow-hidden z-20">
            {/* 1. Thanh Progress Bar (Thay thế đồng hồ số) */}
            <div className="h-2 w-full bg-gray-200">
              <div
                className={`h-full transition-all duration-1000 ease-linear bg-linear-to-r ${progressColor}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Header Popup */}
            <div className="p-5 bg-linear-to-r from-mint-500/10 to-emerald-500/10 border-b border-mint-200 relative overflow-hidden">
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-linear-to-br from-mint-500 to-emerald-500 rounded-xl shadow-lg">
                    <Zap className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {t("question_popup.title")}
                    </h3>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {t("question_popup.page", {
                          page: activeCheckpoint.pageNumber,
                        })}
                      </span>
                      {timeLeft > 0 && !isSubmitted && (
                        <span className="text-emerald-600 font-medium flex items-center gap-1 animate-pulse">
                          <Hourglass className="w-3 h-3" />{" "}
                          {t("question_popup.status.ongoing")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nút đóng */}
                <button
                  onClick={() => setActiveCheckpoint(null)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title={t("question_popup.status.closed")}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Question content */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
              <div className="mb-6">
                <p className="font-medium text-gray-900 text-base leading-relaxed bg-linear-to-r from-gray-50 to-white p-4 rounded-xl border border-mint-100 shadow-sm">
                  {activeCheckpoint.question}
                </p>
              </div>

              <div className="space-y-3">
                {activeCheckpoint.options.map((opt: any, idx: number) => {
                  const optId = String.fromCharCode(65 + idx);
                  const isSelected = selectedAnswers.includes(optId);

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleAnswer(optId)}
                      className={`
                          group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 
                          ${
                            isSubmitted || timeLeft === 0
                              ? "opacity-70 cursor-not-allowed"
                              : ""
                          }
                          ${
                            isSelected
                              ? "bg-linear-to-r from-mint-500/10 to-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-200/30 scale-[1.02]"
                              : "bg-linear-to-r from-white to-gray-50 border-mint-200 hover:border-mint-300 hover:shadow-md hover:shadow-mint-100/30"
                          }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 via-transparent to-emerald-500/5" />
                      )}

                      <div className="flex items-center gap-4 p-4 relative z-10">
                        <div
                          className={`
                          w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border-2 shrink-0 transition-all duration-300
                          ${
                            isSelected
                              ? "bg-linear-to-br from-emerald-500 to-green-600 text-white border-emerald-600 shadow-lg shadow-emerald-300/50"
                              : "bg-linear-to-br from-gray-100 to-gray-200 text-gray-600 border-gray-300 group-hover:border-mint-400"
                          }
                        `}
                        >
                          {optId}
                        </div>
                        <span
                          className={`font-medium text-sm flex-1 ${
                            isSelected ? "text-emerald-800" : "text-gray-700"
                          }`}
                        >
                          {opt.text}
                        </span>

                        {isSelected && (
                          <div className="p-1.5 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-lg border border-emerald-300">
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer với submit button */}
            <div className="p-5 border-t border-mint-200 bg-linear-to-r from-white to-mint-50">
              {timeLeft === 0 && !isSubmitted ? (
                <div className="text-center py-3 bg-linear-to-r from-red-50 to-rose-50 rounded-xl border-2 border-red-200 flex items-center justify-center gap-3 shadow-sm">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-red-600">
                    {t("question_popup.time_up")}
                  </span>
                </div>
              ) : isSubmitted ? (
                <div className="text-center py-3 bg-linear-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 flex items-center justify-center gap-3 shadow-sm">
                  <div className="relative">
                    <div className="w-6 h-6 bg-linear-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent border-l-transparent transform rotate-45" />
                    </div>
                    <div className="absolute inset-0 animate-ping bg-emerald-400 rounded-full opacity-30"></div>
                  </div>
                  <span className="font-bold text-emerald-700">
                    {t("question_popup.submitted")}
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswers.length === 0}
                  className="w-full group relative overflow-hidden bg-linear-to-r from-mint-500 to-emerald-600 text-white py-3.5 rounded-xl font-bold hover:from-mint-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-mint-300/50 hover:shadow-xl hover:shadow-emerald-400/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Send className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
                  <span className="relative z-10">
                    {t("question_popup.submit_button")}
                  </span>
                </button>
              )}

              {/* Selected answers info */}
              {selectedAnswers.length > 0 && !isSubmitted && timeLeft > 0 && (
                <div className="mt-3 text-center animate-in fade-in slide-in-from-bottom-2">
                  <div className="inline-flex items-center gap-2 bg-linear-to-r from-blue-50 to-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm">
                    <span className="text-xs text-blue-600 font-medium">
                      {t("question_popup.selected_answers")}
                    </span>
                    <div className="flex gap-1">
                      {selectedAnswers.map((ans) => (
                        <span
                          key={ans}
                          className="w-6 h-6 bg-linear-to-br from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm"
                        >
                          {ans}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info badge khi không có câu hỏi */}
        {!activeCheckpoint && (
          <div className="absolute top-6 right-6 bg-linear-to-r from-white to-mint-50 border-2 border-mint-200 rounded-xl px-4 py-3 shadow-lg shadow-mint-100/30 flex items-center gap-3 animate-in fade-in duration-500">
            <div className="p-2 bg-linear-to-br from-mint-500/10 to-emerald-500/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-mint-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("info_badge.title")}
              </p>
              <p className="text-xs text-gray-500">
                {t("info_badge.description")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
