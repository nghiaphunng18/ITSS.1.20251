"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { UploadCloud } from "lucide-react";

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
  const { user } = useAuth();
  const toast = useToast();

  // State riêng để handle quá trình upload file
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  if (!open) return null;

  const onSubmit = async (data: FormData) => {
    if (!user?.id) return;

    // 1. Lấy file từ FileList
    const file = data.fileList[0];
    if (!file) {
      toast.error("Lỗi", "Vui lòng chọn file PDF");
      return;
    }

    try {
      setIsUploading(true); // Bắt đầu loading upload

      // 2. Upload File trước
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadRes = await axios.post(
        "/api/presentations/upload",
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const fileUrl = uploadRes.data.url; // Nhận về: /uploads/presentations/123-abc.pdf

      // 3. Tạo bài giảng với fileUrl vừa nhận được
      await axios.post("/api/presentations", {
        userId: user.id,
        name: data.name,
        fileUrl: fileUrl,
      });

      reset();
      toast.success("Thành công", "Đã tạo bài giảng mới");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed:", error);
      toast.error("Lỗi", "Có lỗi xảy ra khi upload hoặc tạo bài giảng");
    } finally {
      setIsUploading(false); // Tắt loading upload
    }
  };

  const isLoading = isSubmitting || isUploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Tạo bài giảng mới
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tên bài giảng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên bài giảng <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name", { required: "Vui lòng nhập tên bài giảng" })}
              className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="VD: Chương 2 - Scrum Framework"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Upload File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File bài giảng (PDF) <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer relative">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input
                      {...register("fileList", {
                        required: "Vui lòng chọn file",
                      })}
                      type="file"
                      accept="application/pdf"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
              </div>
            </div>
            {/* Hiển thị lỗi file */}
            {errors.fileList && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fileList.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              )}
              {isUploading ? "Đang tải lên..." : "Tạo bài giảng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
