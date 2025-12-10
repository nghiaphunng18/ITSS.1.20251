"use client";

import { useState } from "react";
import { Dialog, Button, Flex, Text, TextField } from "@radix-ui/themes";
import { FiUpload, FiFile } from "react-icons/fi";
import { useToast } from "@/contexts/ToastContext";

interface AssignmentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string;
  studentId: string;
  onUpload: (fileData: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }) => void;
}

export function AssignmentUploadDialog({
  open,
  onOpenChange,
  assignmentId,
  studentId,
  onUpload,
}: AssignmentUploadDialogProps) {
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileName || !fileUrl) {
      toast.error("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setUploading(true);
    try {
      const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
      const mimeTypes: Record<string, string> = {
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ppt: "application/vnd.ms-powerpoint",
        pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        txt: "text/plain",
        csv: "text/csv",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        mp4: "video/mp4",
        webm: "video/webm",
        mp3: "audio/mpeg",
        wav: "audio/wav",
        zip: "application/zip",
        rar: "application/x-rar-compressed",
      };

      const fileData = {
        fileName,
        fileUrl,
        fileSize: 1024 * 1024, // Mock 1MB size
        mimeType: mimeTypes[fileExtension] || "application/octet-stream",
      };

      // Upload to API
      const response = await fetch(`/api/assignments/${assignmentId}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          ...fileData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      toast.success("Thành công", "Đã tải lên tệp");
      setFileName("");
      setFileUrl("");
      onUpload(fileData);
      onOpenChange(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Lỗi", "Không thể tải lên tệp");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        <Dialog.Title>Tải lên bài nộp</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Tải lên tệp cho bài tập (PDF, Word, Excel, PowerPoint, hình ảnh,
          video, nén...)
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Tên tệp <span className="text-red-500">*</span>
              </Text>
              <TextField.Root
                placeholder="VD: Bai_tap_1.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
              >
                <TextField.Slot>
                  <FiFile />
                </TextField.Slot>
              </TextField.Root>
              <Text size="1" className="text-gray-500 mt-1">
                Bao gồm phần mở rộng (.pdf, .docx, .zip, etc.)
              </Text>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                URL tệp <span className="text-red-500">*</span>
              </Text>
              <TextField.Root
                placeholder="https://example.com/file.pdf"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                required
                type="url"
              />
              <Text size="1" className="text-gray-500 mt-1">
                Liên kết đến tệp (trong thực tế sẽ tự động tải lên)
              </Text>
            </label>

            <Flex gap="3" justify="end" className="mt-2">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">
                  Hủy
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                className="bg-mint-500"
                disabled={uploading}
              >
                <FiUpload size={16} />
                {uploading ? "Đang tải lên..." : "Tải lên"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
