"use client";

import React from "react";
import { Card, Flex, Text, Badge, Button } from "@radix-ui/themes";
import {
  FiFile,
  FiFileText,
  FiVideo,
  FiImage,
  FiMusic,
  FiDownload,
  FiTrash2,
} from "react-icons/fi";
import { VideoPlayer } from "./VideoPlayer";

interface MaterialCardProps {
  material: {
    id: string;
    title: string;
    description?: string | null;
    fileName: string;
    fileUrl: string;
    fileSize?: number | null;
    mimeType?: string | null;
    materialType: string;
    uploadedBy?: {
      id: string;
      name: string;
    } | null;
    createdAt?: Date | string;
  };
  canDelete?: boolean;
  onDelete?: (id: string) => void;
}

export function MaterialCard({
  material,
  canDelete = false,
  onDelete,
}: MaterialCardProps) {
  const getIcon = () => {
    switch (material.materialType) {
      case "VIDEO":
        return <FiVideo size={20} className="text-purple-500" />;
      case "PDF":
      case "DOCUMENT":
        return <FiFileText size={20} className="text-red-500" />;
      case "PRESENTATION":
        return <FiFileText size={20} className="text-orange-500" />;
      case "IMAGE":
        return <FiImage size={20} className="text-blue-500" />;
      case "AUDIO":
        return <FiMusic size={20} className="text-green-500" />;
      default:
        return <FiFile size={20} className="text-gray-500" />;
    }
  };

  const getTypeLabel = () => {
    switch (material.materialType) {
      case "VIDEO":
        return "Video";
      case "PDF":
        return "PDF";
      case "DOCUMENT":
        return "Tài liệu";
      case "PRESENTATION":
        return "Slide";
      case "IMAGE":
        return "Hình ảnh";
      case "AUDIO":
        return "Audio";
      default:
        return "Khác";
    }
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = material.fileUrl;
    link.download = material.fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Video materials get special treatment
  if (material.materialType === "VIDEO") {
    return (
      <Flex direction="column" gap="3">
        <VideoPlayer
          videoUrl={material.fileUrl}
          fileName={material.fileName}
          fileSize={material.fileSize}
        />
        <Card className="bg-white">
          <Flex direction="column" gap="2">
            <Flex justify="between" align="start">
              <Flex direction="column" gap="1" className="flex-1">
                <Text weight="bold" size="3">
                  {material.title}
                </Text>
                {material.description && (
                  <Text size="2" className="text-gray-600">
                    {material.description}
                  </Text>
                )}
              </Flex>
              {canDelete && onDelete && (
                <Button
                  size="1"
                  color="red"
                  variant="ghost"
                  onClick={() => onDelete(material.id)}
                >
                  <FiTrash2 size={14} />
                </Button>
              )}
            </Flex>
            <Flex gap="2" align="center" className="text-sm text-gray-500">
              {material.uploadedBy && (
                <>
                  <Text size="2">Đăng bởi: {material.uploadedBy.name}</Text>
                  <Text size="2">•</Text>
                </>
              )}
              {material.fileSize && (
                <Text size="2">{formatFileSize(material.fileSize)}</Text>
              )}
            </Flex>
          </Flex>
        </Card>
      </Flex>
    );
  }

  // Non-video materials
  return (
    <Card className="bg-white hover:shadow-md transition-shadow">
      <Flex gap="3" align="start">
        <div className="p-3 bg-gray-50 rounded-lg">{getIcon()}</div>
        <Flex direction="column" gap="2" className="flex-1 min-w-0">
          <Flex justify="between" align="start" gap="2">
            <Flex direction="column" gap="1" className="flex-1 min-w-0">
              <Flex gap="2" align="center" wrap="wrap">
                <Text weight="bold" size="3" className="truncate">
                  {material.title}
                </Text>
                <Badge color="gray" variant="soft">
                  {getTypeLabel()}
                </Badge>
              </Flex>
              {material.description && (
                <Text size="2" className="text-gray-600 line-clamp-2">
                  {material.description}
                </Text>
              )}
              <Flex gap="2" align="center" className="text-sm text-gray-500">
                {material.uploadedBy && (
                  <>
                    <Text size="1">{material.uploadedBy.name}</Text>
                    <Text size="1">•</Text>
                  </>
                )}
                <Text size="1" className="truncate">
                  {material.fileName}
                </Text>
                {material.fileSize && (
                  <>
                    <Text size="1">•</Text>
                    <Text size="1">{formatFileSize(material.fileSize)}</Text>
                  </>
                )}
              </Flex>
            </Flex>
            <Flex gap="1">
              <Button
                size="2"
                variant="soft"
                onClick={handleDownload}
                className="shrink-0"
              >
                <FiDownload size={16} />
              </Button>
              {canDelete && onDelete && (
                <Button
                  size="2"
                  color="red"
                  variant="soft"
                  onClick={() => onDelete(material.id)}
                  className="shrink-0"
                >
                  <FiTrash2 size={16} />
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
