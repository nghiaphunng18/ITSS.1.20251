"use client";

import { useState } from "react";
import { Badge, Button, Card, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import {
  FiFile,
  FiFileText,
  FiDownload,
  FiExternalLink,
  FiX,
} from "react-icons/fi";
import { useTranslations } from "next-intl";

interface DocumentViewerProps {
  attachment: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize?: number | null;
    mimeType?: string | null;
  };
  trigger?: React.ReactNode;
}

export function DocumentViewer({ attachment, trigger }: DocumentViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('common.files');

  // Format file size
  const formatFileSize = (bytes?: number | null): string => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // Get file extension
  const getFileExtension = () => {
    const ext = attachment.fileName.split(".").pop()?.toUpperCase();
    return ext || "FILE";
  };

  // Get file icon
  const getFileIcon = () => {
    const mimeType = attachment.mimeType?.toLowerCase() || "";

    if (mimeType.includes("pdf")) {
      return <FiFileText size={20} className="text-red-500" />;
    }
    if (mimeType.includes("document") || mimeType.includes("word")) {
      return <FiFileText size={20} className="text-blue-600" />;
    }
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
      return <FiFileText size={20} className="text-green-600" />;
    }
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) {
      return <FiFileText size={20} className="text-orange-500" />;
    }

    return <FiFile size={20} className="text-gray-500" />;
  };

  // Check if file can be previewed
  const canPreview = () => {
    const mimeType = attachment.mimeType?.toLowerCase() || "";
    return mimeType.includes("pdf");
  };

  // Handle download
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = attachment.fileUrl;
    link.download = attachment.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle open in new tab
  const handleOpenInNewTab = () => {
    window.open(attachment.fileUrl, "_blank");
  };

  const defaultTrigger = (
    <Card className="bg-white hover:bg-gray-50 transition-colors cursor-pointer">
      <Flex gap="3" align="center" className="p-3">
        <div className="flex-shrink-0">{getFileIcon()}</div>
        <Flex direction="column" gap="1" className="flex-1 min-w-0">
          <Text size="2" weight="medium" className="truncate">
            {attachment.fileName}
          </Text>
          <Flex align="center" gap="2">
            <Badge size="1" color="gray">
              {getFileExtension()}
            </Badge>
            <Text size="1" className="text-gray-500">
              {formatFileSize(attachment.fileSize)}
            </Text>
          </Flex>
        </Flex>
        <Button
          size="1"
          variant="soft"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
        >
          <FiDownload size={16} />
        </Button>
      </Flex>
    </Card>
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        {trigger || defaultTrigger}
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: "90vw", maxHeight: "90vh" }}>
        <Flex direction="column" gap="3" style={{ height: "85vh" }}>
          {/* Header */}
          <Flex align="center" justify="between" gap="3">
            <Flex align="center" gap="2" className="flex-1 min-w-0">
              {getFileIcon()}
              <Flex direction="column" gap="1" className="flex-1 min-w-0">
                <Heading size="4" className="truncate">
                  {attachment.fileName}
                </Heading>
                <Flex align="center" gap="2">
                  <Badge size="1" color="gray">
                    {getFileExtension()}
                  </Badge>
                  <Text size="1" className="text-gray-500">
                    {formatFileSize(attachment.fileSize)}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Dialog.Close>
              <Button variant="soft" color="gray" size="1">
                <FiX size={16} />
              </Button>
            </Dialog.Close>
          </Flex>

          {/* Actions */}
          <Flex gap="2">
            <Button
              size="2"
              variant="soft"
              onClick={handleDownload}
            >
              <FiDownload size={16} /> {t('download')}
            </Button>
            <Button
              size="2"
              variant="soft"
              color="gray"
              onClick={handleOpenInNewTab}
            >
              <FiExternalLink size={16} /> {t('open_new_tab')}
            </Button>
          </Flex>

          {/* Document Preview */}
          <div className="flex-1 overflow-auto border rounded-md bg-gray-50">
            {canPreview() ? (
              <iframe
                src={attachment.fileUrl}
                className="w-full h-full"
                title={attachment.fileName}
                style={{ minHeight: "600px" }}
              />
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                gap="3"
                className="h-full"
              >
                {getFileIcon()}
                <Flex direction="column" align="center" gap="2">
                  <Text size="3" weight="medium">
                    {t('no_preview')}
                  </Text>
                  <Text size="2" className="text-gray-500">
                    {attachment.mimeType?.includes("word") || 
                     attachment.mimeType?.includes("document")
                      ? t('word_no_preview')
                      : t('download_to_view')}
                  </Text>
                  <Button size="3" onClick={handleDownload} className="mt-2">
                    <FiDownload size={18} /> {t('download_file')}
                  </Button>
                </Flex>
              </Flex>
            )}
          </div>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
