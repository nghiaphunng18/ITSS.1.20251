"use client";

import { useState } from "react";
import {
  Dialog,
  Flex,
  Text,
  Button,
  TextField,
  TextArea,
  Select,
  Checkbox,
} from "@radix-ui/themes";
import { FiX } from "react-icons/fi";
import { FilePickerInput, FileAttachment } from "./FilePickerInput";

interface CreateAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    description: string;
    dueDate: string;
    maxPoints: number;
    groupId: string | null;
    isSeparateSubmission: boolean;
    attachments?: FileAttachment[];
  }) => Promise<void>;
  groups?: Array<{ id: string; name: string }>;
}

export function CreateAssignmentDialog({
  open,
  onOpenChange,
  onSubmit,
  groups = [],
}: CreateAssignmentDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxPoints: 100,
    groupId: null as string | null,
    isSeparateSubmission: true,
  });
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.dueDate) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
      // Reset form
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        maxPoints: 100,
        groupId: null,
        isSeparateSubmission: true,
      });
      setAttachments([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create assignment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="600px">
        <Dialog.Title>
          <Flex justify="between" align="center">
            <Text size="5" weight="bold">
              Tạo bài tập mới
            </Text>
            <Dialog.Close>
              <Button variant="ghost" color="gray">
                <FiX size={20} />
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Title>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4" className="mt-4">
            {/* Title */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Tiêu đề <span className="text-red-500">*</span>
              </Text>
              <TextField.Root
                placeholder="Nhập tiêu đề bài tập..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </label>

            {/* Description */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Mô tả
              </Text>
              <TextArea
                placeholder="Nhập mô tả chi tiết bài tập..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </label>

            {/* Due Date */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Hạn nộp <span className="text-red-500">*</span>
              </Text>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                min={minDate}
                required
              />
            </label>

            {/* Max Points */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Điểm tối đa
              </Text>
              <TextField.Root
                type="number"
                placeholder="100"
                value={formData.maxPoints.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxPoints: parseInt(e.target.value) || 100,
                  })
                }
                min="0"
              />
            </label>

            {/* Group Selection */}
            {groups.length > 0 && (
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Giao cho nhóm (tùy chọn)
                </Text>
                <Select.Root
                  value={formData.groupId || "all"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      groupId: value === "all" ? null : value,
                    })
                  }
                >
                  <Select.Trigger
                    className="w-full"
                    placeholder="Chọn nhóm..."
                  />
                  <Select.Content>
                    <Select.Item value="all">Tất cả sinh viên</Select.Item>
                    {groups.map((group) => (
                      <Select.Item key={group.id} value={group.id}>
                        {group.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Text size="1" className="text-gray-500 mt-1">
                  Để trống để giao cho tất cả sinh viên trong lớp
                </Text>
              </label>
            )}

            {/* Submission Type for Group Assignments */}
            {formData.groupId && (
              <label>
                <Flex gap="2" align="center">
                  <Checkbox
                    checked={formData.isSeparateSubmission}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        isSeparateSubmission: checked === true,
                      })
                    }
                  />
                  <Text size="2">Mỗi thành viên nộp bài riêng</Text>
                </Flex>
                <Text size="1" className="text-gray-500 ml-6 mt-1">
                  {formData.isSeparateSubmission
                    ? "Mỗi thành viên trong nhóm phải nộp bài riêng của mình"
                    : "Chỉ cần một thành viên nộp bài cho cả nhóm"}
                </Text>
              </label>
            )}

            {/* Attachments */}
            <div>
              <Text as="div" size="2" mb="2" weight="bold">
                Tệp đính kèm
              </Text>
              <FilePickerInput
                value={attachments}
                onChange={setAttachments}
                maxFiles={10}
              />
            </div>

            {/* Actions */}
            <Flex gap="3" justify="end" className="mt-2">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">
                  Hủy
                </Button>
              </Dialog.Close>
              <Button
                className="bg-mint-500 hover:bg-mint-600"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang tạo..." : "Tạo bài tập"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
