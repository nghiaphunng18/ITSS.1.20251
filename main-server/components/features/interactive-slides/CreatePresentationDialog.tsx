/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle,
  Loader2,
  FileUp,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

type FormData = {
  name: string;
  fileList: FileList;
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePresentationDialog({
  open,
  onClose,
  onSuccess,
}: Props) {
  const t = useTranslations("create_presentation_dialog");
  const { user } = useAuth();
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  if (!open) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error(t("toast.error_format_title"), t("form.file_format_error"));
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValue("fileList", null as any);
  };

  const onSubmit = async (data: FormData) => {
    if (!user?.id) return;

    const file = selectedFile || data.fileList[0];

    if (!file) {
      toast.error(t("toast.error_missing_title"), t("form.file_missing_error"));
      return;
    }

    try {
      setIsUploading(true);

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadRes = await axios.post(
        "/api/presentations/upload",
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const fileUrl = uploadRes.data.url;

      await axios.post("/api/presentations", {
        userId: user.id,
        name: data.name,
        fileUrl: fileUrl,
      });

      reset();
      setSelectedFile(null);
      toast.success(t("toast.success_title"), t("toast.success_message"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed:", error);
      toast.error(
        t("toast.error_general_title"),
        t("toast.error_general_message")
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-linear-to-br from-white to-mint-50 rounded-2xl shadow-2xl shadow-mint-200/50 p-0 overflow-hidden scale-100 transform transition-all border border-mint-100">
        {/* Header với gradient xanh lá */}
        <div className="px-8 py-6 border-b border-mint-200 bg-linear-to-r from-mint-500 to-emerald-500 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <FileUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{t("title")}</h2>
                <p className="text-mint-100 text-sm mt-1">{t("subtitle")}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
            >
              <X size={22} className="cursor-pointer" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* Tên bài giảng */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-mint-500"></div>
              {t("form.name_label")}
              <span className="text-red-400">{t("form.name_required")}</span>
            </label>
            <input
              {...register("name", {
                required: t("form.name_error"),
              })}
              className={`w-full border-2 rounded-xl px-5 py-3.5 outline-none transition-all duration-200 focus:ring-3 focus:ring-mint-200/50 focus:border-mint-500 bg-white ${
                errors.name
                  ? "border-red-300 focus:ring-red-100"
                  : "border-mint-200"
              }`}
              placeholder={t("form.name_placeholder")}
              disabled={isUploading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Upload Area */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-mint-500"></div>
              {t("form.file_label")}
              <span className="text-red-400">{t("form.file_required")}</span>
            </label>

            {!selectedFile ? (
              <div className="relative group">
                <div
                  className={`
                    flex flex-col items-center justify-center w-full h-48 
                    border-3 border-dashed rounded-2xl cursor-pointer 
                    bg-linear-to-br from-white to-mint-50
                    hover:bg-linear-to-br hover:from-mint-50 hover:to-white
                    hover:border-mint-400 hover:shadow-lg hover:shadow-mint-200/30
                    transition-all duration-300
                    ${
                      errors.fileList
                        ? "border-red-300 bg-red-50"
                        : "border-mint-300"
                    }
                  `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                    <div className="relative mb-4">
                      <div className="p-4 bg-white rounded-full shadow-md shadow-mint-200 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-mint-300 transition-all duration-300">
                        <UploadCloud className="w-10 h-10 text-mint-500" />
                      </div>
                      <div className="absolute -top-1 -right-1 p-1.5 bg-emerald-100 rounded-full">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                    <p className="mb-2 text-base font-semibold text-gray-800">
                      {t("form.upload_area.drag_drop")}
                    </p>
                    <p className="text-sm text-gray-500 text-center max-w-xs">
                      {t("form.upload_area.description")}
                    </p>
                    <div className="mt-4 px-4 py-2 bg-mint-100 rounded-lg">
                      <p className="text-xs font-medium text-mint-700 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {t("form.upload_area.live_document")}
                      </p>
                    </div>
                  </div>
                  <input
                    {...register("fileList", {
                      required: t("form.file_missing_error"),
                    })}
                    type="file"
                    accept="application/pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      register("fileList").onChange(e);
                      handleFileChange(e);
                    }}
                  />
                </div>
                {errors.fileList && (
                  <p className="text-red-500 text-sm mt-2 font-medium text-center">
                    {errors.fileList.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="relative group">
                <div className="flex items-center p-5 bg-linear-to-r from-mint-50 to-emerald-50 border-2 border-mint-300 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-mint-400">
                  <div className="relative">
                    <div className="p-4 bg-white rounded-xl shadow-sm mr-5 border border-mint-100">
                      <FileText className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-100 rounded-full border border-white">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-900 truncate">
                      {selectedFile.name}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-2.5 py-1 bg-mint-100 text-mint-700 text-xs font-semibold rounded-lg">
                        {formatFileSize(selectedFile.size)}
                      </span>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg">
                        {t("form.file_selected.pdf_document")}
                      </span>
                    </div>
                  </div>

                  {!isUploading && (
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 ml-3"
                      title={t("form.file_selected.remove_title")}
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-mint-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {t("buttons.cancel")}
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-mint-500 to-emerald-500 rounded-xl hover:from-mint-600 hover:to-emerald-600 hover:shadow-lg hover:shadow-mint-300/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-md transition-all duration-200 active:scale-98 group"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {t("buttons.uploading")}
                </>
              ) : (
                <>
                  <div className="relative">
                    <CheckCircle size={18} />
                    <div className="absolute inset-0 animate-ping opacity-20">
                      <CheckCircle size={18} />
                    </div>
                  </div>
                  <span className="cursor-pointer">{t("buttons.create")}</span>
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
