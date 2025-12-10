"use client";

import { useState } from "react";
import { Button, Flex, Text, IconButton, Badge, Card } from "@radix-ui/themes";
import {
  FiFile,
  FiFileText,
  FiImage,
  FiVideo,
  FiMusic,
  FiX,
  FiPaperclip,
} from "react-icons/fi";

export interface FileAttachment {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

interface FilePickerInputProps {
  value?: FileAttachment[];
  onChange?: (attachments: FileAttachment[]) => void;
  attachments?: FileAttachment[];
  onAttachmentsChange?: (attachments: FileAttachment[]) => void;
  maxFiles?: number;
}

export function FilePickerInput({
  value,
  onChange,
  attachments: attachmentsProp,
  onAttachmentsChange,
  maxFiles = 5,
}: FilePickerInputProps) {
  // Support both naming conventions
  const attachments = value ?? attachmentsProp ?? [];
  const handleChange = onChange ?? onAttachmentsChange ?? (() => {});
  const [isAdding, setIsAdding] = useState(false);
  const [newFile, setNewFile] = useState({
    fileName: "",
    fileUrl: "",
  });

  // Get MIME type from file extension
  const getMimeType = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase();
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
      svg: "image/svg+xml",
      mp4: "video/mp4",
      webm: "video/webm",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      zip: "application/zip",
      rar: "application/x-rar-compressed",
    };
    return mimeTypes[ext || ""] || "application/octet-stream";
  };

  // Get file icon based on MIME type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("video/")) {
      return <FiVideo size={16} className="text-purple-500" />;
    }
    if (mimeType.startsWith("image/")) {
      return <FiImage size={16} className="text-blue-500" />;
    }
    if (mimeType.startsWith("audio/")) {
      return <FiMusic size={16} className="text-pink-500" />;
    }
    if (
      mimeType.includes("pdf") ||
      mimeType.includes("document") ||
      mimeType.includes("word")
    ) {
      return <FiFileText size={16} className="text-red-500" />;
    }
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
      return <FiFileText size={16} className="text-green-500" />;
    }
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) {
      return <FiFileText size={16} className="text-orange-500" />;
    }
    return <FiFile size={16} className="text-gray-500" />;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const handleAddFile = () => {
    if (!newFile.fileName || !newFile.fileUrl) return;

    const mimeType = getMimeType(newFile.fileName);
    const fileSize = 1024 * 1024; // Mock 1MB file size

    const newAttachment: FileAttachment = {
      fileName: newFile.fileName,
      fileUrl: newFile.fileUrl,
      fileSize,
      mimeType,
    };

    handleChange([...attachments, newAttachment]);
    setNewFile({ fileName: "", fileUrl: "" });
    setIsAdding(false);
  };

  const handleRemoveFile = (index: number) => {
    const updated = attachments.filter((_, i) => i !== index);
    handleChange(updated);
  };

  return (
    <Flex direction="column" gap="2">
      {/* File list */}
      {attachments.length > 0 && (
        <Flex direction="column" gap="2">
          {attachments.map((file, index) => (
            <Card key={index} size="1">
              <Flex align="center" gap="2" className="p-2">
                {getFileIcon(file.mimeType)}
                <Flex direction="column" gap="1" className="flex-1 min-w-0">
                  <Text size="1" weight="medium" className="truncate">
                    {file.fileName}
                  </Text>
                  <Text size="1" className="text-gray-500">
                    {formatFileSize(file.fileSize)}
                  </Text>
                </Flex>
                <IconButton
                  size="1"
                  variant="soft"
                  color="red"
                  onClick={() => handleRemoveFile(index)}
                >
                  <FiX size={14} />
                </IconButton>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}

      {/* Add file button/form */}
      {isAdding ? (
        <Card size="1">
          <Flex direction="column" gap="2" className="p-2">
            <input
              type="text"
              placeholder="Tên file (ví dụ: document.pdf)"
              value={newFile.fileName}
              onChange={(e) =>
                setNewFile({ ...newFile, fileName: e.target.value })
              }
              className="w-full px-2 py-1 text-sm border rounded"
            />
            <input
              type="text"
              placeholder="URL file (ví dụ: https://example.com/file.pdf)"
              value={newFile.fileUrl}
              onChange={(e) =>
                setNewFile({ ...newFile, fileUrl: e.target.value })
              }
              className="w-full px-2 py-1 text-sm border rounded"
            />
            <Flex gap="2" justify="end">
              <Button
                size="1"
                variant="soft"
                color="gray"
                onClick={() => {
                  setIsAdding(false);
                  setNewFile({ fileName: "", fileUrl: "" });
                }}
              >
                Hủy
              </Button>
              <Button
                size="1"
                onClick={handleAddFile}
                disabled={!newFile.fileName || !newFile.fileUrl}
              >
                Thêm
              </Button>
            </Flex>
          </Flex>
        </Card>
      ) : (
        attachments.length < maxFiles && (
          <Button
            size="1"
            variant="soft"
            onClick={() => setIsAdding(true)}
            className="w-full"
          >
            <FiPaperclip size={14} /> Đính kèm file ({attachments.length}/
            {maxFiles})
          </Button>
        )
      )}

      {attachments.length >= maxFiles && (
        <Text size="1" className="text-gray-500">
          Đã đạt giới hạn {maxFiles} file
        </Text>
      )}
    </Flex>
  );
}
