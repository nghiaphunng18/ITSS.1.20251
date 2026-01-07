"use client";

import { useState } from "react";
import { Button, Flex, Text, IconButton, Badge, Card } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("common.files");
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setIsAdding(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      const newAttachment: FileAttachment = {
        fileName: result.fileName,
        fileUrl: result.fileUrl,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
      };

      handleChange([...attachments, newAttachment]);
    } catch (error) {
      console.error("Failed to upload file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsAdding(false);
      // Reset file input
      e.target.value = "";
    }
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
          <Flex direction="column" gap="2" className="p-3">
            <Text size="2" weight="medium">{t('uploading')}</Text>
          </Flex>
        </Card>
      ) : (
        attachments.length < maxFiles && (
          <label className="cursor-pointer">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.gif,.mp4,.webm,.mp3,.wav,.zip,.rar"
            />
            <Button
              size="1"
              variant="soft"
              type="button"
              className="w-full"
              asChild
            >
              <span>
                <FiPaperclip size={14} /> {t('attach_file_count', { count: attachments.length, max: maxFiles })}
              </span>
            </Button>
          </label>
        )
      )}

      {attachments.length >= maxFiles && (
        <Text size="1" className="text-gray-500">
          {t('file_limit_reached', { max: maxFiles })}
        </Text>
      )}
    </Flex>
  );
}
