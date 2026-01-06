/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Users,
  FileBarChart,
  Clock,
  PlayCircle,
  History,
  Zap,
  BarChart3,
  TrendingUp,
  Layers,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function PresentationReportsPage() {
  const t = useTranslations("presentation_reports_page");
  const params = useParams();
  const presentationId = params?.id as string;
  const locale = useLocale();

  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    totalInteractions: 0,
  });

  useEffect(() => {
    axios
      .get(`/api/presentations/${presentationId}/sessions`)
      .then((res) => {
        const sessionsData = res.data;
        setSessions(sessionsData);

        const totalInteractions = sessionsData.reduce(
          (sum: number, session: any) => sum + (session._count?.responses || 0),
          0
        );

        const activeSessions = sessionsData.filter(
          (session: any) => session.isActive
        ).length;

        setStats({
          totalSessions: sessionsData.length,
          activeSessions,
          totalInteractions,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [presentationId]);

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-mint-25 to-emerald-25 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header với gradient */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {/* Back button */}
              <Link
                href={`/${locale}/dashboard/teacher/presentations`}
                title={t("header.back_button")}
                className="group flex items-center justify-center w-12 h-12 rounded-2xl border-2 border-mint-200 bg-linear-to-br from-white to-gray-50 text-gray-600 hover:border-mint-300 hover:from-mint-50 hover:to-white transition-all duration-300 shadow-md shadow-mint-100/50 hover:shadow-lg hover:shadow-mint-200/50 active:scale-95 self-start mt-1.5"
              >
                <ArrowLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
              </Link>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-linear-to-br from-mint-500 to-emerald-500 rounded-2xl shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-gray-900 to-mint-700 bg-clip-text text-transparent">
                      {t("header.title")}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      {t("header.subtitle")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-linear-to-br from-white to-mint-50 rounded-2xl p-4 border border-mint-100 shadow-lg shadow-mint-100/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("stats.total_sessions")}
                    </p>
                    <p className="text-2xl font-bold text-mint-700 mt-2">
                      {stats.totalSessions}
                    </p>
                  </div>
                  <div className="p-3 bg-linear-to-br from-mint-100 to-mint-50 rounded-xl">
                    <Layers className="w-6 h-6 text-mint-500" />
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-white to-emerald-50 rounded-2xl p-4 border border-emerald-100 shadow-lg shadow-emerald-100/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("stats.active_sessions")}
                    </p>
                    <p className="text-2xl font-bold text-emerald-700 mt-2">
                      {stats.activeSessions}
                    </p>
                  </div>
                  <div className="p-3 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-xl">
                    <Zap className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-white to-blue-50 rounded-2xl p-4 border border-blue-100 shadow-lg shadow-blue-100/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("stats.total_interactions")}
                    </p>
                    <p className="text-2xl font-bold text-blue-700 mt-2">
                      {stats.totalInteractions}
                    </p>
                  </div>
                  <div className="p-3 bg-linear-to-br from-blue-100 to-blue-50 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl animate-pulse border border-gray-300/20"
              />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-linear-to-br from-white to-mint-25 rounded-3xl border-2 border-dashed border-mint-200 shadow-inner">
            <div className="relative mb-6">
              <div className="p-6 bg-linear-to-br from-mint-100 to-white rounded-2xl shadow-lg">
                <History className="w-16 h-16 text-mint-300" />
              </div>
              <div className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg">
                <Sparkles className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {t("empty_state.title")}
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-8">
              {t("empty_state.description")}
            </p>
            <Link
              href={`/${locale}/dashboard/teacher/presentations/${presentationId}/live`}
              className="group flex items-center gap-3 bg-linear-to-r from-mint-500 to-emerald-500 text-white px-6 py-3.5 rounded-xl hover:from-mint-600 hover:to-emerald-600 font-semibold transition-all duration-300 shadow-lg shadow-mint-300/50 hover:shadow-xl hover:shadow-emerald-400/50 active:scale-95"
            >
              <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{t("empty_state.start_first_session")}</span>
              <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                  session.isActive
                    ? "bg-linear-to-br from-white to-emerald-25 border-emerald-300 shadow-lg shadow-emerald-200/30"
                    : "bg-linear-to-br from-white to-gray-25 border-gray-200 hover:border-mint-300 hover:shadow-mint-200/30"
                }`}
              >
                {/* Active session glow effect */}
                {session.isActive && (
                  <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 via-transparent to-emerald-500/5 animate-pulse" />
                )}

                <div className="p-6 relative z-10">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Session Info - Chiếm phần lớn không gian */}
                    <div className="space-y-4 flex-1">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-mint-700 transition-colors">
                            {session.sessionName}
                          </h3>
                          {session.isActive ? (
                            <span className="flex items-center gap-2 bg-linear-to-r from-emerald-500/20 to-green-500/20 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-500/30 shadow-sm">
                              <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </div>
                              {t("session_card.active_badge")}
                            </span>
                          ) : (
                            <span className="bg-linear-to-r from-gray-500/10 to-gray-600/10 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-400/30">
                              {t("session_card.ended_badge")}
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-mint-500" />
                          {new Date(session.startedAt).toLocaleTimeString(
                            "vi-VN",

                            {
                              hour: "2-digit",

                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>

                      {/* Session details */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-linear-to-r from-mint-50 to-white px-3 py-2 rounded-lg border border-mint-100">
                          <Clock className="w-4 h-4 text-mint-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {new Date(session.startedAt).toLocaleTimeString(
                              "vi-VN",

                              {
                                hour: "2-digit",

                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>

                        {session.endedAt && (
                          <div className="flex items-center gap-2 bg-linear-to-r from-gray-50 to-white px-3 py-2 rounded-lg border border-gray-100">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {t("session_card.ended_time")}:
                              {new Date(session.endedAt).toLocaleTimeString(
                                "vi-VN",

                                {
                                  hour: "2-digit",

                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 bg-linear-to-r from-purple-50 to-white px-3 py-2 rounded-lg border border-purple-100">
                          <History className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {t("session_card.session_id", {
                              id: session.id.slice(-8),
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Stats and Actions - Một cột dọc */}
                    <div className="flex flex-col gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 lg:w-[220px] lg:ml-auto">
                      {/* Interaction Card - Cùng kiểu với button */}
                      <div className="flex items-center justify-center gap-3 min-h-[52px] px-4 rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-700 font-semibold">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span>{session._count?.responses || 0}</span>
                        <span className="text-sm text-blue-500">
                          {t("session_card.interactions", {
                            count: session._count?.responses || 0,
                          })}
                        </span>
                      </div>

                      {/* Action buttons - Một cột dọc */}
                      <div className="flex flex-col gap-3">
                        {/* Nút Quay lại Live (Chỉ hiện khi Active) */}
                        {session.isActive && (
                          <Link
                            href={`/${locale}/dashboard/teacher/presentations/${presentationId}/live?sessionId=${session.id}`}
                            className="group/live flex items-center justify-center gap-3 bg-linear-to-r from-emerald-500 to-green-600 text-white px-4 py-3 rounded-xl hover:from-emerald-600 hover:to-green-700 font-semibold transition-all duration-300 shadow-lg shadow-emerald-300/50 hover:shadow-xl hover:shadow-emerald-400/50 active:scale-95"
                          >
                            <div className="relative">
                              <PlayCircle
                                size={20}
                                className="group-hover/live:scale-110 transition-transform"
                              />
                              <div className="absolute inset-0 animate-ping opacity-20 bg-emerald-400 rounded-full"></div>
                            </div>
                            <span>
                              {t("session_card.buttons.back_to_live")}
                            </span>
                          </Link>
                        )}

                        {/* Nút Xem báo cáo */}
                        <Link
                          href={`/${locale}/dashboard/teacher/presentations/report/${session.id}`}
                          className="group/report flex items-center justify-center gap-3 bg-linear-to-r from-white to-gray-50 text-gray-700 border-2 border-mint-200 px-4 py-3 rounded-xl hover:bg-linear-to-r hover:from-mint-50 hover:to-white hover:text-mint-700 hover:border-mint-300 font-semibold transition-all duration-300 shadow-lg shadow-mint-100/50 hover:shadow-xl hover:shadow-mint-200/50 active:scale-95"
                        >
                          <div className="relative">
                            <FileBarChart
                              size={20}
                              className="group-hover/report:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-mint-100 rounded-full opacity-0 group-hover/report:opacity-100 -z-10 transition-opacity duration-300" />
                          </div>
                          <span>{t("session_card.buttons.view_report")}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom accent */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 ${
                    session.isActive
                      ? "bg-linear-to-r from-emerald-500 to-green-500"
                      : "bg-linear-to-r from-gray-300 to-gray-400"
                  }`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
