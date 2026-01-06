"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Presentation } from "@/types/presentation";
import CreatePresentationDialog from "@/components/features/interactive-slides/CreatePresentationDialog";
import {
  Plus,
  FileText,
  Edit,
  Play,
  BarChart2,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import StartSessionDialog from "@/components/features/interactive-slides/StartSessionDialog";
import { useLocale, useTranslations } from "next-intl";

export default function PresentationsPage() {
  const t = useTranslations("presentations_page");
  const locale = useLocale();

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);
  const [selectedPresentation, setSelectedPresentation] =
    useState<Presentation | null>(null);

  const fetchPresentations = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/presentations/teacher/${user.id}`);
      setPresentations(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPresentations();
    }
  }, [isAuthenticated, fetchPresentations]);

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin"></div>
          <p className="text-mint-600 font-medium">
            {t("loading_presentations")}
          </p>
        </div>
      </div>
    );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-mint-25 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section với gradient */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-b from-mint-500 to-emerald-500 rounded-2xl shadow-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-linear-to-b from-gray-900 to-mint-700 bg-clip-text text-transparent">
                  {t("header.title")}
                </h1>
                <p className="text-gray-500 mt-1 text-sm md:text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-mint-400" />
                  {t("header.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-mint-50 rounded-lg border border-mint-100">
                <Users className="w-4 h-4 text-mint-500" />
                <span className="text-sm font-medium text-mint-700">
                  {t("header.presentations_count", {
                    count: presentations.length,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700">
                  {t("header.live_document")}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsDialogOpen(true)}
            className="group relative flex items-center justify-center gap-3 bg-linear-to-b from-mint-500 to-emerald-500 text-white px-6 py-3.5 rounded-xl hover:from-mint-600 hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-mint-200/50 hover:shadow-xl hover:shadow-mint-300/50 font-semibold active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-b from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Plus size={22} className="relative z-10" />
            <span className="relative z-10">{t("header.upload_new")}</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 relative z-10" />
          </button>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 bg-linear-to-br from-white to-mint-25 rounded-2xl border border-mint-100 animate-pulse overflow-hidden"
              >
                <div className="h-40 bg-mint-100"></div>
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-mint-100 rounded"></div>
                  <div className="h-4 bg-mint-100 rounded w-3/4"></div>
                  <div className="h-8 bg-mint-100 rounded mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : presentations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-linear-to-b from-white to-mint-25 rounded-3xl border-2 border-dashed border-mint-200 shadow-inner">
            <div className="relative mb-5">
              <div className="p-5 bg-linear-to-br from-mint-100 to-white rounded-2xl shadow-lg">
                <FileText className="h-16 w-16 text-mint-300" />
              </div>
              <div className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg">
                <Sparkles className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {t("empty_state.title")}
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-8">
              {t("empty_state.description")}
            </p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="group flex items-center gap-2 text-mint-600 font-semibold hover:text-emerald-600 transition-colors px-6 py-3 rounded-xl hover:bg-mint-50 border border-mint-200"
            >
              <Plus className="w-5 h-5" />
              <span>{t("empty_state.create_first")}</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {presentations.map((p) => (
              <div
                key={p.id}
                className="group relative bg-linear-to-b from-white to-mint-25 border border-mint-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-mint-200/50 hover:border-mint-300 transition-all duration-500 hover:-translate-y-1 flex flex-col h-full"
              >
                {/* Badge Live */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-linear-to-b from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    {t("presentation_card.live_badge")}
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="h-40 relative overflow-hidden bg-linear-to-br from-mint-50 to-emerald-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-20 h-20 text-mint-200 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-linear-to-tr from-mint-500/0 via-emerald-500/0 to-mint-500/0 group-hover:from-mint-500/5 group-hover:via-emerald-500/10 group-hover:to-mint-500/5 transition-all duration-500" />
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3
                    className="font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-mint-700 transition-colors text-lg"
                    title={p.name}
                  >
                    {p.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(p.updatedAt || new Date()).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t border-mint-100">
                    {/* Edit Button */}
                    <Link
                      href={`/${locale}/dashboard/teacher/presentations/${p.id}/edit`}
                      className="group/edit flex flex-col items-center justify-center py-2.5 rounded-xl hover:bg-mint-50 text-gray-600 hover:text-mint-600 transition-all duration-300 gap-1.5 hover:shadow-sm"
                      title={t("presentation_card.edit_title")}
                    >
                      <div className="relative">
                        <Edit size={18} />
                        <div className="absolute inset-0 bg-mint-100 rounded-full opacity-0 group-hover/edit:opacity-100 -z-10 transition-opacity duration-300" />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wide">
                        {t("presentation_card.edit_button")}
                      </span>
                    </Link>

                    {/* Reports Button */}
                    <Link
                      href={`/${locale}/dashboard/teacher/presentations/${p.id}/reports`}
                      className="group/report flex flex-col items-center justify-center py-2.5 rounded-xl hover:bg-purple-50 text-gray-600 hover:text-purple-600 transition-all duration-300 gap-1.5 hover:shadow-sm"
                      title={t("presentation_card.reports_title")}
                    >
                      <div className="relative">
                        <BarChart2 size={18} />
                        <div className="absolute inset-0 bg-purple-100 rounded-full opacity-0 group-hover/report:opacity-100 -z-10 transition-opacity duration-300" />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wide">
                        {t("presentation_card.reports_button")}
                      </span>
                    </Link>

                    {/* Live Session Button */}
                    <button
                      onClick={() => {
                        setSelectedPresentation(p);
                        setIsStartDialogOpen(true);
                      }}
                      className="group/live relative flex flex-col items-center justify-center py-2.5 rounded-xl bg-linear-to-b from-emerald-50 to-white border border-emerald-100 text-emerald-600 hover:bg-linear-to-b hover:from-emerald-100 hover:to-white hover:text-emerald-700 hover:border-emerald-200 hover:shadow-emerald-200/50 hover:shadow-md transition-all duration-300 gap-1.5 cursor-pointer"
                      title={t("presentation_card.live_title")}
                    >
                      <div className="relative">
                        <Play
                          size={18}
                          fill="currentColor"
                          className="group-hover/live:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 animate-ping opacity-20 bg-emerald-400 rounded-full group-hover/live:animate-none"></div>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {t("presentation_card.live_button")}
                      </span>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full group-hover/live:animate-pulse"></div>
                    </button>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-linear-to-tl from-mint-500/5 to-transparent rounded-tl-2xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Dialogs */}
        <CreatePresentationDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={fetchPresentations}
        />

        {selectedPresentation && (
          <StartSessionDialog
            open={isStartDialogOpen}
            onClose={() => {
              setIsStartDialogOpen(false);
              setSelectedPresentation(null);
            }}
            presentationId={selectedPresentation.id}
            presentationName={selectedPresentation.name}
          />
        )}
      </div>
    </div>
  );
}
