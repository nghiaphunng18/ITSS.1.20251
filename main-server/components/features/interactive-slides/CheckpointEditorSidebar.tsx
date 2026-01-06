"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  Plus,
  Trash2,
  Save,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Target,
} from "lucide-react";
import { CheckpointData, SaveCheckpointRequest } from "@/types/presentation";
import { useTranslations } from "next-intl";

type CheckpointFormValues = {
  question: string;
  options: { text: string }[];
  correctAnswer: string[];
  timeLimit: number;
};

interface Props {
  pageNumber: number;
  existingCheckpoint?: CheckpointData;
  onSave: (data: Omit<SaveCheckpointRequest, "userId">) => Promise<void>;
  onDelete: () => Promise<void>;
  isSaving: boolean;
}

export default function CheckpointEditorSidebar({
  pageNumber,
  existingCheckpoint,
  onSave,
  onDelete,
  isSaving,
}: Props) {
  const t = useTranslations("checkpoint_editor_sidebar");

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CheckpointFormValues>({
    defaultValues: {
      question: "",
      options: [{ text: "" }, { text: "" }],
      correctAnswer: [],
      timeLimit: 30,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const currentCorrectAnswers = useWatch({
    control,
    name: "correctAnswer",
    defaultValue: [],
  });

  useEffect(() => {
    if (existingCheckpoint) {
      reset({
        question: existingCheckpoint.question,
        options: existingCheckpoint.options.map((opt) => ({ text: opt.text })),
        correctAnswer: existingCheckpoint.correctAnswer || [],
        timeLimit: existingCheckpoint.timeLimit,
      });
    } else {
      reset({
        question: "",
        options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
        correctAnswer: [],
        timeLimit: 30,
      });
    }
  }, [existingCheckpoint, pageNumber, reset]);

  const onSubmit = (data: CheckpointFormValues) => {
    if (data.correctAnswer.length === 0) {
      alert(t("alerts.no_correct_answer"));
      return;
    }

    const formattedOptions = data.options.map((opt, index) => ({
      id: String.fromCharCode(65 + index),
      text: opt.text,
    }));

    const validIDs = formattedOptions.map((o) => o.id);
    const cleanCorrectAnswers = data.correctAnswer.filter((id) =>
      validIDs.includes(id)
    );

    const payload = {
      pageNumber,
      question: data.question,
      options: formattedOptions,
      correctAnswer: cleanCorrectAnswers,
      timeLimit: Number(data.timeLimit),
    };
    onSave(payload);
  };

  const handleCheckboxChange = (id: string) => {
    const current = [...currentCorrectAnswers];
    if (current.includes(id)) {
      setValue(
        "correctAnswer",
        current.filter((item) => item !== id)
      );
    } else {
      setValue("correctAnswer", [...current, id]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-linear-to-b from-white via-mint-25 to-emerald-25 border-l border-mint-200 shadow-2xl shadow-mint-300/20 z-20">
      {/* Header Sidebar với gradient 3D */}
      <div className="px-6 py-5 border-b border-mint-300/50 bg-linear-to-r from-mint-500/10 to-emerald-500/10 backdrop-blur-sm relative overflow-hidden">
        {/* Hiệu ứng background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(110,231,183,0.1),transparent_50%)]" />

        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-linear-to-br from-mint-500 to-emerald-500 rounded-xl shadow-lg shadow-emerald-300/30">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg bg-linear-to-r from-gray-900 to-mint-700 bg-clip-text">
              {existingCheckpoint
                ? t("header.edit_title")
                : t("header.new_title")}
            </h3>
          </div>
          <span className="bg-linear-to-r from-mint-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-mint-400/50 shadow-lg shadow-mint-300/30">
            {t("header.page_indicator", { pageNumber })}
          </span>
        </div>
        <p className="text-sm text-gray-600 relative z-10 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          {t("header.subtitle")}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
        <form
          id="checkpoint-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Câu hỏi Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <div className="p-2 bg-linear-to-br from-mint-500/10 to-emerald-500/10 rounded-lg">
                <BookOpen className="w-4 h-4 text-mint-600" />
              </div>
              <span>{t("form.question_section.label")}</span>
              <span className="text-red-400 text-xs">
                {t("form.question_section.required")}
              </span>
            </label>
            <div className="relative group">
              <textarea
                {...register("question", { required: true })}
                className="w-full border-2 border-mint-200 rounded-xl p-4 text-sm focus:ring-3 focus:ring-mint-200/50 focus:border-mint-500 outline-none min-h-[120px] resize-none transition-all duration-300 bg-white shadow-sm group-hover:shadow-md group-hover:shadow-mint-200/30"
                placeholder={t("form.question_section.placeholder")}
              />
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-mint-300/30 transition-all duration-300 pointer-events-none" />
            </div>
            {errors.question && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4" />
                <span>{t("form.question_section.error")}</span>
              </div>
            )}
          </div>

          {/* Danh sách đáp án */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-linear-to-br from-emerald-500/10 to-green-500/10 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <span>{t("form.options_section.label")}</span>
              </label>
              <button
                type="button"
                onClick={() => append({ text: "" })}
                disabled={fields.length >= 6}
                className="text-sm flex items-center gap-2 bg-linear-to-r from-mint-500/10 to-emerald-500/10 text-mint-700 hover:text-emerald-700 hover:from-mint-500/20 hover:to-emerald-500/20 px-3 py-2 rounded-lg font-medium transition-all duration-300 border border-mint-200 hover:border-mint-300 group/add"
              >
                <Plus className="w-4 h-4 group-hover/add:scale-110 transition-transform" />
                {t("form.options_section.add_button")}
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => {
                const optionLabel = String.fromCharCode(65 + index);
                const isChecked = currentCorrectAnswers.includes(optionLabel);

                return (
                  <div
                    key={field.id}
                    className={`group relative p-0.5 rounded-xl transition-all duration-300 ${
                      isChecked
                        ? "bg-linear-to-r from-emerald-500/20 to-green-500/20"
                        : "bg-linear-to-r from-mint-500/5 to-transparent hover:from-mint-500/10"
                    }`}
                  >
                    <div className="flex gap-3 items-center bg-white rounded-xl p-3 shadow-sm">
                      {/* Nút chọn đáp án đúng với gradient 3D */}
                      <button
                        type="button"
                        onClick={() => handleCheckboxChange(optionLabel)}
                        className={`
                          relative w-10 h-10 shrink-0 flex items-center justify-center rounded-xl font-bold text-sm transition-all duration-300
                          shadow-lg transform hover:scale-105 active:scale-95
                          ${
                            isChecked
                              ? "bg-linear-to-br from-emerald-500 to-green-600 text-white shadow-emerald-300/50"
                              : "bg-linear-to-br from-gray-100 to-gray-200 text-gray-600 hover:from-mint-100 hover:to-mint-200 hover:text-mint-700 border border-gray-300/50"
                          }
                        `}
                        title={t("form.button_titles.select_correct")}
                      >
                        {isChecked && (
                          <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent rounded-xl" />
                        )}
                        {optionLabel}
                        {isChecked && (
                          <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-emerald-600 bg-white rounded-full shadow" />
                        )}
                      </button>

                      {/* Input nội dung với hiệu ứng */}
                      <div className="flex-1 relative">
                        <input
                          {...register(`options.${index}.text` as const, {
                            required: true,
                          })}
                          className={`
                            w-full h-full border-2 rounded-lg px-4 py-3 text-sm outline-none transition-all duration-300 bg-transparent
                            ${
                              isChecked
                                ? "border-emerald-300 text-emerald-800 bg-linear-to-r from-emerald-50/30 to-white focus:ring-2 focus:ring-emerald-200/50"
                                : "border-mint-200 text-gray-800 hover:border-mint-300 focus:border-mint-500 focus:ring-2 focus:ring-mint-200/50"
                            }
                          `}
                          placeholder={t(
                            "form.options_section.input_placeholder",
                            { optionLabel }
                          )}
                        />
                        <div
                          className={`absolute inset-0 rounded-lg border-2 border-transparent pointer-events-none transition-all duration-300 ${
                            isChecked
                              ? "group-hover:border-emerald-400/30"
                              : "group-hover:border-mint-300/30"
                          }`}
                        />
                      </div>

                      {/* Nút xoá */}
                      {fields.length > 2 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 border border-transparent hover:border-red-200"
                          title={t("form.button_titles.remove_option")}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 bg-linear-to-r from-mint-50 to-emerald-50 p-3 rounded-lg border border-mint-100">
              <AlertCircle className="w-4 h-4 text-mint-500 shrink-0" />
              <span>
                {t("form.options_section.hint")}
                <span className="text-emerald-600 font-medium">
                  {" "}
                  {t("form.options_section.multiple_answers")}
                </span>
              </span>
            </div>
          </div>

          {/* Thời gian */}
          <div className="space-y-3 pt-4 border-t border-mint-100">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <div className="p-2 bg-linear-to-br from-orange-500/10 to-amber-500/10 rounded-lg">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <span>{t("form.time_section.label")}</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 to-transparent rounded-xl blur-sm group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <input
                  type="number"
                  {...register("timeLimit", { min: 10, max: 1800 })}
                  className="relative w-28 border-2 border-amber-200 rounded-xl p-3 text-center font-medium text-amber-700 bg-white focus:ring-3 focus:ring-amber-200/50 focus:border-amber-500 outline-none transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:shadow-amber-200/30"
                  min="10"
                  max="1800"
                />
              </div>
              <span className="text-sm font-medium text-gray-600">
                {t("form.time_section.unit")}
              </span>
            </div>
          </div>
        </form>
      </div>

      {/* Footer Actions với gradient 3D */}
      <div className="p-6 border-t border-mint-200 bg-linear-to-r from-white to-mint-50 relative overflow-hidden">
        {/* Hiệu ứng background */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(110,231,183,0.05)_50%,transparent_75%)] bg-size-[400%_400%] animate-gradient-shift" />

        <div className="flex gap-3 relative z-10">
          {existingCheckpoint && (
            <button
              type="button"
              onClick={() => {
                if (confirm(t("buttons.delete_confirmation"))) {
                  onDelete();
                }
              }}
              className="flex items-center justify-center px-4 py-3 bg-linear-to-br from-white to-gray-50 border-2 border-red-200 text-red-600 rounded-xl hover:bg-linear-to-br hover:from-red-50 hover:to-white hover:border-red-300 hover:text-red-700 transition-all duration-300 active:scale-95 shadow-lg shadow-red-100/50 hover:shadow-red-200/50 group"
              title={t("buttons.delete")}
              disabled={isSaving}
            >
              <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}

          <button
            form="checkpoint-form"
            type="submit"
            disabled={isSaving}
            className="flex-1 flex justify-center items-center gap-3 bg-linear-to-r from-mint-500 to-emerald-500 text-white py-3.5 rounded-xl hover:from-mint-600 hover:to-emerald-600 font-semibold transition-all duration-300 shadow-xl shadow-mint-300/50 hover:shadow-2xl hover:shadow-emerald-400/50 disabled:opacity-70 disabled:cursor-not-allowed active:scale-98 group relative overflow-hidden"
          >
            {/* Hiệu ứng ánh sáng khi hover */}
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t("buttons.processing")}</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>
                  {existingCheckpoint ? t("buttons.save") : t("buttons.create")}
                </span>
                <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom CSS cho animation gradient */}
      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient-shift {
          animation: gradient-shift 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
