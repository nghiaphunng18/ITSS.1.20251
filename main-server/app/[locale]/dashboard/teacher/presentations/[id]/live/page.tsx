"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axios from "@/lib/axios";
import { io, Socket } from "socket.io-client";
import { Presentation, CheckpointData } from "@/types/presentation";
import {
  ChevronLeft,
  ChevronRight,
  Radio,
  XCircle,
  PlayCircle,
  LinkIcon,
  Users,
  Timer,
  Award,
  BarChart as ChartIcon,
  Zap,
  Globe,
  CheckCircle,
  Circle,
  List,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useToast } from "@/contexts/ToastContext";
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
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin"></div>
        <p className="text-mint-600 font-medium">{text}</p>
      </div>
    </div>
  );
}

export default function TeacherLivePage() {
  const t = useTranslations("teacher_live_page");
  const locale = useLocale();

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const presentationId = params?.id as string;
  const sessionId = searchParams.get("sessionId");
  const { user } = useAuth();
  const toast = useToast();

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeCheckpointId, setActiveCheckpointId] = useState<string | null>(
    null
  );

  const [liveStats, setLiveStats] = useState<Record<string, number>>({});
  const [totalResponses, setTotalResponses] = useState(0);

  // Timer States
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const deadlineRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Tự động đóng phiên khi đóng Tab/Trình duyệt
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!sessionId) return;
      fetch(`/api/sessions/${sessionId}/end`, {
        method: "PATCH",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sessionId]);

  // Load dữ liệu
  useEffect(() => {
    if (!sessionId) {
      alert(t("missing_session_id"));
      router.back();
      return;
    }
    axios.get(`/api/presentations/${presentationId}`).then((res) => {
      setPresentation(res.data);
    });
  }, [presentationId, sessionId, router, t]);

  // Socket
  useEffect(() => {
    if (!user || !sessionId) return;

    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Teacher connected to socket");
      setIsConnected(true);
      socket.emit("JOIN_SESSION", {
        sessionId,
        userId: user.id,
        role: "TEACHER",
      });
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("LIVE_STAT_UPDATE", ({ answerData }) => {
      setLiveStats((prev) => {
        const newState = { ...prev };
        const answers = Array.isArray(answerData) ? answerData : [answerData];
        answers.forEach((ans: string) => {
          newState[ans] = (newState[ans] || 0) + 1;
        });
        return newState;
      });
      setTotalResponses((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionId, user]);

  const calculateDeadline = useCallback((duration: number): number => {
    return Date.now() + duration * 1000;
  }, []);

  const stopCheckpoint = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit("TEACHER_STOP_CHECKPOINT", { sessionId });
    setActiveCheckpointId(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(0);
    setTotalTime(0);
    deadlineRef.current = 0;
  }, [sessionId]);

  const handleActivateCheckpoint = useCallback(
    (checkpoint: CheckpointData) => {
      if (!socketRef.current || !sessionId) return;

      setLiveStats({});
      setTotalResponses(0);
      setActiveCheckpointId(checkpoint.id);

      const duration = checkpoint.timeLimit || 30;
      const deadline = calculateDeadline(duration);

      deadlineRef.current = deadline;
      setTimeLeft(duration);
      setTotalTime(duration);

      socketRef.current.emit("TEACHER_TRIGGER_CHECKPOINT", {
        sessionId,
        checkpointData: checkpoint,
        deadline: deadline,
      });

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      timerRef.current = setInterval(() => {
        const now = Date.now();
        const secondsLeft = Math.max(
          0,
          Math.ceil((deadlineRef.current - now) / 1000)
        );

        if (secondsLeft <= 0) {
          stopCheckpoint();
          return;
        }
        setTimeLeft(secondsLeft);
      }, 500);
    },
    [calculateDeadline, stopCheckpoint, sessionId]
  );

  const handleManualStop = useCallback(() => {
    stopCheckpoint();
  }, [stopCheckpoint]);

  const handleCopyStudentLink = useCallback(() => {
    if (!sessionId) return;
    const origin = window.location.origin;
    const currentLocale = window.location.pathname.split("/")[1] || "vi";
    const studentLink = `${origin}/${currentLocale}/dashboard/student/presentations/live?sessionId=${sessionId}`;
    navigator.clipboard.writeText(studentLink);
    toast.success(t("success"), t("link_copied"));
  }, [sessionId, toast, t]);

  const handleEndSession = useCallback(async () => {
    if (!confirm(t("end_session_confirmation"))) return;

    try {
      if (activeCheckpointId && socketRef.current) {
        socketRef.current.emit("TEACHER_STOP_CHECKPOINT", { sessionId });
      }

      await axios.patch(`/api/sessions/${sessionId}/end`);

      const locale = window.location.pathname.split("/")[1] || "vi";
      router.push(
        `/${locale}/dashboard/teacher/presentations/report/${sessionId}`
      );
    } catch (e) {
      console.error("Error close session:", e);
      toast.error(t("error"), t("end_session_error"));
    }
  }, [sessionId, router, activeCheckpointId, toast, t]);

  const currentCheckpoints =
    presentation?.checkpoints?.filter((cp) => cp.pageNumber === currPage) || [];

  const chartData = Object.entries(liveStats)
    .map(([key, value]) => ({ name: key, value: value }))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!presentation)
    return (
      <div className="h-screen flex items-center justify-center bg-linear-to-br from-mint-50 to-emerald-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin"></div>
            <Zap className="absolute -top-2 -right-2 w-6 h-6 text-emerald-500 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-mint-700 font-semibold text-lg">
              {t("preparing_session")}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {t("please_wait_moment")}
            </p>
          </div>
        </div>
      </div>
    );

  // Tính phần trăm cho Progress Bar
  const progressPercent = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  const progressColor =
    progressPercent > 50
      ? "from-emerald-500 to-green-500"
      : progressPercent > 20
      ? "from-amber-500 to-yellow-500"
      : "from-red-500 to-rose-500";

  // Component để render danh sách đáp án
  const renderAnswerOptions = (checkpoint: CheckpointData) => {
    return (
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-2">
          <List className="w-3.5 h-3.5" />
          <span>{t("options")}:</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {checkpoint.options.map((option) => {
            const isCorrect = checkpoint.correctAnswer.includes(option.id);
            return (
              <div
                key={option.id}
                className={`flex items-start gap-3 p-2.5 rounded-lg transition-all ${
                  isCorrect
                    ? "bg-linear-to-r from-emerald-500/15 to-emerald-600/10 border border-emerald-500/30"
                    : "bg-linear-to-r from-gray-800/50 to-gray-900/30 border border-gray-700/30"
                }`}
              >
                <div
                  className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                    isCorrect
                      ? "bg-linear-to-br from-emerald-500 to-green-600 text-white"
                      : "bg-linear-to-br from-gray-700 to-gray-800 text-gray-300"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-bold ${
                        isCorrect ? "text-emerald-300" : "text-gray-400"
                      }`}
                    >
                      {option.id}.
                    </span>
                    <span
                      className={`text-sm ${
                        isCorrect ? "text-emerald-200" : "text-gray-300"
                      }`}
                    >
                      {option.text}
                    </span>
                  </div>
                  {isCorrect && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
                      <CheckCircle className="w-3 h-3" />
                      <span className="font-medium">{t("correct_answer")}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-gray-900 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* TOPBAR với gradient */}
      <div className="h-16 bg-linear-to-r from-gray-800 via-gray-800 to-gray-900 border-b border-gray-700/50 flex items-center justify-between px-6 shrink-0 shadow-xl shadow-black/20 relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-mint-500/5 via-emerald-500/5 to-transparent" />

        <div className="flex items-center gap-4 relative z-10">
          {/* Session Info */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-linear-to-br from-mint-500 to-emerald-500 rounded-xl shadow-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-bold text-gray-100 truncate max-w-[300px] text-base">
                  {presentation.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isConnected
                        ? "bg-linear-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-linear-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full animate-pulse ${
                        isConnected ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                    {isConnected ? t("live") : t("offline")}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                <Users className="w-3 h-3" />
                <span>
                  {t("active_session")} • {t("id")}: {sessionId?.slice(-8)}
                </span>
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-gray-700 mx-2"></div>

          {/* Link button */}
          <button
            onClick={handleCopyStudentLink}
            className="flex items-center gap-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 group active:scale-95"
          >
            <LinkIcon
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span>{t("copy_join_link")}</span>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4 relative z-10">
          {/* Pagination */}
          <div className="flex items-center gap-2 bg-linear-to-br from-gray-800 to-gray-900 px-3 py-2 rounded-xl border border-gray-700/50 shadow-lg">
            <button
              onClick={() => setCurrPage((p) => Math.max(1, p - 1))}
              disabled={currPage <= 1}
              className="p-1.5 hover:bg-gray-700/50 rounded-lg text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex flex-col items-center min-w-20">
              <span className="font-bold text-gray-100 text-sm">
                {t("page")} {currPage}
              </span>
              <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden mt-1">
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
              className="p-1.5 hover:bg-gray-700/50 rounded-lg text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* End session button */}
          <button
            onClick={handleEndSession}
            className="flex items-center gap-2 bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 active:scale-95 group"
          >
            <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {t("end_session")}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: PDF Viewer */}
        <div className="flex-1 bg-linear-to-br from-gray-950 to-gray-900 relative flex flex-col">
          <div className="flex-1 overflow-auto flex justify-center p-6">
            <div className="max-w-6xl w-full h-full rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl bg-gray-900">
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

          {/* Current page indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl">
            <span className="text-sm text-gray-300">{t("current_page")}:</span>
            <span className="font-bold text-white text-lg">{currPage}</span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">{totalPages}</span>
          </div>
        </div>

        {/* RIGHT: Controller Panel */}
        <div className="w-[480px] bg-linear-to-b from-gray-900 via-gray-900 to-gray-950 border-l border-gray-700/50 flex flex-col shadow-2xl shadow-black/20">
          {/* Panel Header */}
          <div className="p-5 border-b border-gray-700/50 bg-linear-to-r from-gray-800 via-gray-800 to-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-mint-500/10 via-transparent to-emerald-500/10" />

            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-linear-to-br from-mint-500 to-emerald-500 rounded-xl shadow-lg">
                  <Radio className="w-5 h-5 text-white animate-pulse" />
                </div>
                <h3 className="font-bold text-lg text-gray-100">
                  {t("live_control_panel")}
                </h3>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-mint-500/20 to-emerald-500/20 rounded-lg border border-mint-500/30">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-300">
                  {currentCheckpoints.length} {t("questions")}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-400 relative z-10 flex items-center gap-2">
              <ChartIcon className="w-4 h-4 text-mint-500" />
              {t("panel_description")}
            </p>
          </div>

          {/* Questions Panel */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
            {currentCheckpoints.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <div className="p-5 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-lg mb-4">
                  <Award className="w-12 h-12 text-gray-600" />
                </div>
                <h4 className="font-semibold text-gray-300 text-center mb-2">
                  {t("no_questions")}
                </h4>
                <p className="text-sm text-gray-500 text-center max-w-xs">
                  {t("no_questions_description")}
                </p>
              </div>
            ) : (
              currentCheckpoints.map((cp) => {
                const isActive = activeCheckpointId === cp.id;
                return (
                  <div
                    key={cp.id}
                    className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                      isActive
                        ? "bg-linear-to-br from-gray-800 to-gray-900 border-emerald-500/50 shadow-2xl shadow-emerald-500/20"
                        : "bg-linear-to-br from-gray-800 to-gray-900 border-gray-700/50 shadow-lg hover:shadow-xl hover:shadow-mint-500/10 hover:border-mint-500/30"
                    }`}
                  >
                    {/* Background glow effect for active */}
                    {isActive && (
                      <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-transparent to-emerald-500/5 animate-pulse" />
                    )}

                    <div className="p-5 relative z-10">
                      {/* Question Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-linear-to-r from-mint-500/20 to-emerald-500/20 text-mint-300 text-xs font-bold rounded-full border border-mint-500/30">
                            {t("question")}
                          </span>
                          {isActive && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-linear-to-r from-emerald-500/30 to-green-500/30 text-emerald-200 text-xs font-bold rounded-full border border-emerald-500/30 animate-pulse">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              {t("active")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 px-2.5 py-1 bg-linear-to-r from-gray-700 to-gray-800 rounded-lg border border-gray-600">
                          <Timer className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-xs font-medium text-amber-300">
                            {cp.timeLimit || 30}s
                          </span>
                        </div>
                      </div>

                      {/* Question Content */}
                      <p className="font-medium text-gray-100 text-sm mb-4">
                        {cp.question}
                      </p>

                      {/* Render answer options */}
                      {renderAnswerOptions(cp)}

                      {isActive ? (
                        <div className="space-y-4 mt-4">
                          {/* Stats Container */}
                          <div className="bg-linear-to-br from-gray-900 to-gray-950 rounded-xl p-4 border border-gray-700/50 shadow-inner">
                            {/* Stats Header */}
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-300">
                                  <strong className="text-white text-lg">
                                    {totalResponses}
                                  </strong>{" "}
                                  {t("responses")}
                                </span>
                              </div>

                              {/* Timer with progress bar */}
                              <div className="flex flex-col items-end">
                                <div className="text-xs text-gray-400 mb-1">
                                  {t("time_remaining")}
                                </div>
                                <div className="w-32 bg-gray-800 h-2 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full bg-linear-to-r ${progressColor} transition-all duration-500 ease-out rounded-full`}
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Chart */}
                            <div className="h-40 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                  <XAxis
                                    dataKey="name"
                                    stroke="#9ca3af"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: "#d1d5db" }}
                                  />
                                  <Tooltip
                                    cursor={{
                                      fill: "rgba(255, 255, 255, 0.05)",
                                    }}
                                    contentStyle={{
                                      background:
                                        "linear-gradient(135deg, #1f2937, #111827)",
                                      border: "1px solid #374151",
                                      borderRadius: "12px",
                                      fontSize: "12px",
                                      color: "#f9fafb",
                                      backdropFilter: "blur(10px)",
                                    }}
                                    formatter={(value) => [
                                      `${value} ${t("count_unit")}`,
                                      t("count"),
                                    ]}
                                  />
                                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={
                                          cp.correctAnswer.includes(entry.name)
                                            ? "url(#correctGradient)"
                                            : "url(#incorrectGradient)"
                                        }
                                      />
                                    ))}
                                  </Bar>
                                  <defs>
                                    <linearGradient
                                      id="correctGradient"
                                      x1="0"
                                      y1="0"
                                      x2="0"
                                      y2="1"
                                    >
                                      <stop
                                        offset="0%"
                                        stopColor="#22c55e"
                                        stopOpacity={0.8}
                                      />
                                      <stop
                                        offset="100%"
                                        stopColor="#16a34a"
                                        stopOpacity={0.9}
                                      />
                                    </linearGradient>
                                    <linearGradient
                                      id="incorrectGradient"
                                      x1="0"
                                      y1="0"
                                      x2="0"
                                      y2="1"
                                    >
                                      <stop
                                        offset="0%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0.8}
                                      />
                                      <stop
                                        offset="100%"
                                        stopColor="#2563eb"
                                        stopOpacity={0.9}
                                      />
                                    </linearGradient>
                                  </defs>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Stop button */}
                          <button
                            onClick={handleManualStop}
                            className="w-full flex items-center justify-center gap-3 bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 active:scale-95 group"
                          >
                            <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {t("stop_question")}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <button
                            onClick={() => handleActivateCheckpoint(cp)}
                            disabled={activeCheckpointId !== null}
                            className="w-full flex items-center justify-center gap-3 bg-linear-to-r from-mint-500 to-emerald-600 hover:from-mint-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-mint-500/25 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95 group"
                          >
                            <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {t("start_question")} ({cp.timeLimit || 30}s)
                            <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-5 border-t border-gray-700/50 bg-linear-to-r from-gray-800 via-gray-800 to-gray-900">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activeCheckpointId
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-gray-500"
                  }`}
                />
                <span>
                  {activeCheckpointId
                    ? t("question_running")
                    : t("ready_to_activate")}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {currentCheckpoints.length} {t("questions")} • {t("page")}{" "}
                {currPage}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
