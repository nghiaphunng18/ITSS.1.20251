"use client";

import { useForm } from "react-hook-form";
import axios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useTranslations } from "next-intl";

type FormData = {
  sessionName: string;
};

interface Props {
  presentationId: string;
  presentationName: string;
  open: boolean;
  onClose: () => void;
}

export default function StartSessionDialog({
  presentationId,
  presentationName,
  open,
  onClose,
}: Props) {
  const t = useTranslations("start_session_dialog");
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();

  if (!open) return null;

  const onSubmit = async (data: FormData) => {
    if (!user?.id) return;

    try {
      // 1. Gọi API tạo Session
      const res = await axios.post(
        `/api/presentations/${presentationId}/sessions`,
        {
          userId: user.id,
          sessionName: data.sessionName,
        }
      );

      const newSession = res.data; // id, joinCode...

      toast.success(t("toast.success_title"), t("toast.success_message"));

      const locale = window.location.pathname.split("/")[1] || "vi";
      router.push(
        `/${locale}/dashboard/teacher/presentations/${presentationId}/live?sessionId=${newSession.id}`
      );

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(t("toast.error_title"), t("toast.error_message"));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 text-green-600 rounded-full">
            <Play size={24} fill="currentColor" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{t("title")}</h2>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          {t("description")}{" "}
          <span className="font-semibold text-gray-700">
            {presentationName}
          </span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.session_name_label")}{" "}
              <span className="text-red-500">
                {t("form.session_name_required")}
              </span>
            </label>
            <input
              {...register("sessionName", { required: true })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder={t("form.session_name_placeholder")}
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1">
              {t("form.session_name_help")}
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {t("buttons.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? t("buttons.creating") : t("buttons.start")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
