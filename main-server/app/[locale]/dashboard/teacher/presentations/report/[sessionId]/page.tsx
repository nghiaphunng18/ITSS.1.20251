/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  BarChart2,
  HelpCircle,
  Users,
  FileBarChart,
  TrendingUp,
  Award,
  Sparkles,
  Target,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useLocale, useTranslations } from "next-intl";

// Component Custom Bar để vẽ vạch xanh cho đáp án đúng nhưng 0 lượt chọn
const CustomBarShape = (props: any) => {
  const { x, y, width, height, isCorrect, value } = props;

  const correctColor = "#10b981"; // Emerald 500
  const wrongColor = "#94a3b8"; // Slate 400
  const correctColorLight = "#a7f3d0"; // Emerald 200

  if (value === 0 && isCorrect) {
    return (
      <>
        <rect
          x={x}
          y={y - 3}
          width={width}
          height={3}
          fill={correctColor}
          rx={1.5}
        />
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={correctColorLight}
          fillOpacity={0.3}
          rx={4}
        />
      </>
    );
  }

  const gradientId = `gradient-${isCorrect ? "correct" : "wrong"}-${x}-${y}`;

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor={isCorrect ? correctColor : wrongColor}
            stopOpacity={0.9}
          />
          <stop
            offset="100%"
            stopColor={isCorrect ? correctColor : wrongColor}
            stopOpacity={0.6}
          />
        </linearGradient>
      </defs>
      <path
        d={`M${x},${y + height} L${x},${y} L${x + width},${y} L${x + width},${
          y + height
        } Z`}
        stroke="none"
        fill={`url(#${gradientId})`}
        rx={4}
      />
    </g>
  );
};

export default function SessionReportPage() {
  const t = useTranslations("session_report_page");
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const locale = useLocale();

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({
    totalQuestions: 0,
    totalResponses: 0,
    correctPercentage: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    axios
      .get(`/api/sessions/${sessionId}/report`)
      .then((res) => {
        setData(res.data);

        const reportData = res.data;
        const totalQuestions =
          reportData.presentation?.checkpoints?.length || 0;
        const totalResponses = reportData.responses?.length || 0;

        const correctResponses =
          reportData.responses?.filter((res: any) => {
            const cp = reportData.presentation.checkpoints.find(
              (c: any) => c.id === res.checkpointId
            );
            if (!cp) return false;
            const userAns = (res.answerData as string[]).sort().join(",");
            const correctAns = (
              Array.isArray(cp.correctAnswer) ? cp.correctAnswer : []
            )
              .sort()
              .join(",");
            return userAns === correctAns;
          }).length || 0;

        const correctPercentage =
          totalResponses > 0
            ? Math.round((correctResponses / totalResponses) * 100)
            : 0;

        const uniqueStudents = new Set(
          reportData.responses?.map((r: any) => r.userId) || []
        );

        setSessionStats({
          totalQuestions,
          totalResponses,
          correctPercentage,
          totalStudents: uniqueStudents.size,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [sessionId]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-linear-to-br from-white to-mint-25">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin"></div>
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-emerald-500 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-mint-700 font-semibold text-lg">
              {t("loading.title")}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {t("loading.description")}
            </p>
          </div>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="h-screen flex items-center justify-center bg-linear-to-br from-white to-mint-25">
        <div className="text-center p-8 bg-white rounded-2xl border border-mint-100 shadow-lg max-w-md">
          <div className="p-4 bg-red-50 rounded-full w-16 h-16 mx-auto mb-4">
            <FileBarChart className="w-8 h-8 text-red-400 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t("error.title")}
          </h3>
          <p className="text-gray-500 mb-6">{t("error.description")}</p>
          <Link
            href={`/${locale}/dashboard/teacher/presentations/${data?.presentationId}/reports`}
            className="inline-flex items-center gap-2 text-mint-600 hover:text-emerald-600 font-medium"
          >
            <ArrowLeft size={18} />
            {t("error.back_to_sessions")}
          </Link>
        </div>
      </div>
    );

  const checkpointsMap = new Map();
  data.presentation.checkpoints.forEach((cp: any) => {
    const correctAnswers = Array.isArray(cp.correctAnswer)
      ? cp.correctAnswer
      : [];
    checkpointsMap.set(cp.id, {
      info: { ...cp, correctAnswer: correctAnswers },
      responses: [],
      stats: { A: 0, B: 0, C: 0, D: 0 },
    });
  });

  data.responses.forEach((res: any) => {
    const cpGroup = checkpointsMap.get(res.checkpointId);
    if (cpGroup) {
      const userAns = (res.answerData as string[]).sort().join(",");
      const correctAns = cpGroup.info.correctAnswer.sort().join(",");
      const isCorrect = userAns === correctAns;
      cpGroup.responses.push({ ...res, isCorrect });
      (res.answerData as string[]).forEach((ans) => {
        cpGroup.stats[ans] = (cpGroup.stats[ans] || 0) + 1;
      });
    }
  });

  const reportItems = Array.from(checkpointsMap.values()).sort(
    (a, b) => a.info.pageNumber - b.info.pageNumber
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-mint-25 to-emerald-25 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header với gradient */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/dashboard/teacher/presentations/${data.presentationId}/reports`}
              className="p-3 bg-linear-to-br from-white to-gray-50 border-2 border-mint-200 hover:border-mint-300 hover:from-mint-50 hover:to-white rounded-2xl text-gray-600 transition-all duration-300 shadow-lg shadow-mint-100/50 hover:shadow-xl hover:shadow-mint-200/50 active:scale-95 group -mt-1.5"
            >
              <ArrowLeft
                size={22}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </Link>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-linear-to-br from-mint-500 to-emerald-500 rounded-2xl shadow-lg">
                  <FileBarChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-gray-900 to-mint-700 bg-clip-text text-transparent">
                    {t("header.title")}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    {t("header.subtitle", { sessionName: data.sessionName })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Session stats summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 lg:mt-0">
            <div className="bg-linear-to-br from-white to-mint-50 rounded-2xl p-3 border border-mint-100 shadow-lg shadow-mint-100/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-mint-500/10 to-emerald-500/10 rounded-lg">
                  <BookOpen className="w-4 h-4 text-mint-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {t("header.stats.questions")}
                  </p>
                  <p className="text-lg font-bold text-mint-700">
                    {sessionStats.totalQuestions}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-white to-blue-50 rounded-2xl p-3 border border-blue-100 shadow-lg shadow-blue-100/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {t("header.stats.students")}
                  </p>
                  <p className="text-lg font-bold text-blue-700">
                    {sessionStats.totalStudents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-white to-emerald-50 rounded-2xl p-3 border border-emerald-100 shadow-lg shadow-emerald-100/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-emerald-500/10 to-green-500/10 rounded-lg">
                  <Target className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {t("header.stats.responses")}
                  </p>
                  <p className="text-lg font-bold text-emerald-700">
                    {sessionStats.totalResponses}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-white to-purple-50 rounded-2xl p-3 border border-purple-100 shadow-lg shadow-purple-100/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {t("header.stats.accuracy")}
                  </p>
                  <p className="text-lg font-bold text-purple-700">
                    {sessionStats.correctPercentage}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách câu hỏi */}
        <div className="space-y-6">
          {reportItems.map((item: any, index) => {
            const chartData = Object.entries(item.stats)
              .map(([name, value]) => ({
                name,
                value,
                isCorrect: item.info.correctAnswer.includes(name),
              }))
              .sort((a, b) => a.name.localeCompare(b.name));

            return (
              <div
                key={item.info.id}
                className="group relative overflow-hidden rounded-2xl border-2 bg-linear-to-br from-white to-gray-25 border-mint-200 shadow-lg shadow-mint-100/30 hover:shadow-xl hover:shadow-mint-200/50 transition-all duration-500 hover:-translate-y-1"
              >
                {/* Card Header với gradient */}
                <div className="px-6 py-4 border-b border-mint-100 bg-linear-to-r from-mint-50 to-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-r from-mint-500/5 via-transparent to-emerald-500/5" />

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-linear-to-r from-mint-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                          {t("question_card.question_number", {
                            number: index + 1,
                          })}
                        </span>
                        <span className="text-xs font-medium text-gray-500 bg-mint-100 px-2.5 py-1 rounded-lg border border-mint-200">
                          {t("question_card.page_number", {
                            page: item.info.pageNumber,
                          })}
                        </span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-linear-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                          <Users className="w-3 h-3 text-blue-500" />
                          <span className="text-xs font-medium text-blue-700">
                            {t("question_card.responses_count", {
                              count: item.responses.length,
                            })}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 leading-snug pr-4">
                        {item.info.question}
                      </h3>
                    </div>

                    {/* Answer options preview */}
                    <div className="flex flex-wrap gap-2">
                      {item.info.options.map((opt: any) => {
                        const isCorrect = item.info.correctAnswer.includes(
                          opt.id
                        );
                        return (
                          <div
                            key={opt.id}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${
                              isCorrect
                                ? "bg-linear-to-r from-emerald-50 to-white border-emerald-200 text-emerald-700"
                                : "bg-linear-to-r from-gray-50 to-white border-gray-200 text-gray-600"
                            }`}
                          >
                            <span
                              className={`font-bold ${
                                isCorrect ? "text-emerald-600" : "text-gray-500"
                              }`}
                            >
                              {opt.id}.
                            </span>
                            <span className="truncate max-w-[120px]">
                              {opt.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                  {/* CỘT TRÁI: BIỂU ĐỒ */}
                  <div className="w-full lg:w-2/5 p-6 border-b lg:border-b-0 lg:border-r border-mint-100 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 bg-linear-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                        <BarChart2 size={18} className="text-blue-500" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-700">
                        {t("question_card.chart.title")}
                      </h4>
                    </div>

                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barCategoryGap="20%">
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fill: "#6b7280",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                            dy={10}
                          />
                          <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(110, 231, 183, 0.05)" }}
                            contentStyle={{
                              background:
                                "linear-gradient(135deg, #ffffff, #f0fdfa)",
                              border: "2px solid #a7f3d0",
                              borderRadius: "12px",
                              fontSize: "12px",
                              color: "#064e3b",
                              backdropFilter: "blur(10px)",
                              boxShadow: "0 10px 25px rgba(110, 231, 183, 0.2)",
                            }}
                          />
                          <Bar
                            dataKey="value"
                            shape={<CustomBarShape />}
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Chú thích biểu đồ */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
                      <div className="flex items-center gap-2 bg-linear-to-r from-emerald-50 to-white px-3 py-1.5 rounded-lg border border-emerald-200">
                        <div className="w-3 h-3 rounded bg-linear-to-br from-emerald-500 to-emerald-600"></div>
                        <span className="font-medium text-emerald-700">
                          {t("question_card.chart.legend.correct_answer")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-linear-to-r from-gray-50 to-white px-3 py-1.5 rounded-lg border border-gray-200">
                        <div className="w-3 h-3 rounded bg-linear-to-br from-slate-400 to-slate-500"></div>
                        <span className="font-medium text-gray-600">
                          {t("question_card.chart.legend.wrong_choice")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-linear-to-r from-emerald-50/50 to-white px-3 py-1.5 rounded-lg border border-emerald-200">
                        <div className="w-6 h-1.5 rounded-full bg-linear-to-r from-emerald-400 to-emerald-500"></div>
                        <span className="font-medium text-emerald-600">
                          {t("question_card.chart.legend.not_selected")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CỘT PHẢI: DANH SÁCH SINH VIÊN */}
                  <div className="w-full lg:w-3/5 flex flex-col">
                    <div className="p-4 border-b border-mint-100 bg-linear-to-r from-gray-50 to-white flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-linear-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                          <Users className="w-4 h-4 text-purple-500" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-700">
                          {t("question_card.student_section.title")}
                        </h4>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1.5 bg-linear-to-r from-red-50 to-white px-2.5 py-1 rounded-lg border border-red-100">
                        <HelpCircle size={12} className="text-red-400" />
                        <span>
                          {t("question_card.student_section.wrong_hint")}
                        </span>
                      </span>
                    </div>

                    <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
                      {item.responses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                          <div className="p-4 bg-linear-to-br from-mint-100 to-white rounded-2xl mb-4">
                            <Award className="w-12 h-12 text-mint-300" />
                          </div>
                          <h4 className="font-semibold text-gray-300 text-center mb-2">
                            {t(
                              "question_card.student_section.no_responses.title"
                            )}
                          </h4>
                          <p className="text-sm text-gray-500 text-center max-w-xs">
                            {t(
                              "question_card.student_section.no_responses.description"
                            )}
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-mint-100">
                          {item.responses.map((res: any) => (
                            <div
                              key={res.id}
                              className="p-4 hover:bg-linear-to-r hover:from-mint-50/50 hover:to-white transition-all duration-300"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                {/* Student info */}
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-linear-to-br from-mint-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow">
                                    {res.user.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {res.user.name}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {res.user.studentCode ||
                                        t(
                                          "question_card.student_section.student_code"
                                        )}
                                    </div>
                                  </div>
                                </div>

                                {/* Selected answers */}
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-wrap gap-1.5">
                                    {(res.answerData as string[]).map((ans) => {
                                      const isRight =
                                        item.info.correctAnswer.includes(ans);
                                      return (
                                        <span
                                          key={ans}
                                          className={`
                                            w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold border-2 shadow-sm
                                            ${
                                              isRight
                                                ? "bg-linear-to-br from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-300"
                                                : "bg-linear-to-br from-red-100 to-red-50 text-red-600 border-red-300"
                                            }
                                          `}
                                        >
                                          {ans}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Result and time */}
                                <div className="flex items-center gap-4">
                                  <div>
                                    {res.isCorrect ? (
                                      <div className="flex items-center gap-2 bg-linear-to-r from-emerald-50 to-green-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                                        <CheckCircle
                                          size={16}
                                          className="text-emerald-500"
                                        />
                                        <span className="text-sm font-semibold text-emerald-700">
                                          {t(
                                            "question_card.student_section.answers.correct"
                                          )}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 bg-linear-to-r from-red-50 to-rose-50 px-3 py-1.5 rounded-lg border border-red-200">
                                        <XCircle
                                          size={16}
                                          className="text-red-500"
                                        />
                                        <span className="text-sm font-semibold text-red-600">
                                          {t(
                                            "question_card.student_section.answers.wrong"
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                                    {new Date(
                                      res.submittedAt
                                    ).toLocaleTimeString("vi-VN", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
