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
import { useTranslations } from "next-intl";
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
  const t = useTranslations("assignments.create");
  const tCommon = useTranslations("common.actions");
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
              {t("dialog_title")}
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
                {t("title_label")}
              </Text>
              <TextField.Root
                placeholder={t("title_placeholder")}
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
                {t("description_label")}
              </Text>
              <TextArea
                placeholder={t("description_placeholder")}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                style={{ minHeight: "150px" }}
              />
            </label>

            {/* Due Date & Max Points */}
            <Flex gap="4">
              <label style={{ flex: 1 }}>
                <Text as="div" size="2" mb="1" weight="bold">
                  {t("due_date_label")}
                  <span className="text-red-500"> *</span>
                </Text>
                <TextField.Root
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  required
                />
              </label>
              <label style={{ flex: 1 }}>
                <Text as="div" size="2" mb="1" weight="bold">
                  {t("max_points_label")}
                </Text>
                <TextField.Root
                  type="number"
                  value={formData.maxPoints}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxPoints: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </label>
            </Flex>

            {/* Group Assignment */}
            {groups.length > 0 && (
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  {t("assign_to_group_label")}
                </Text>
                <Select.Root
                  value={formData.groupId || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      groupId: value === "all" ? null : value,
                    })
                  }
                >
                  <Select.Trigger placeholder={t("select_group_placeholder")} />
                  <Select.Content>
                    <Select.Item value="all">{t("all_students")}</Select.Item>
                    {groups.map((group) => (
                      <Select.Item key={group.id} value={group.id}>
                        {group.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Text size="1" className="text-gray-500 mt-1 block">
                  {t("empty_for_all")}
                </Text>
              </label>
            )}

            {/* Submission Type */}
            {formData.groupId && (
              <label>
                <Flex align="center" gap="2">
                  <Checkbox
                    checked={formData.isSeparateSubmission}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        isSeparateSubmission: checked === true,
                      })
                    }
                  />
                  <Text size="2" weight="bold">
                    {t("individual_submission")}
                  </Text>
                </Flex>
                <Text size="1" className="text-gray-500 ml-6 mt-1 block">
                  {formData.isSeparateSubmission
                    ? t("individual_submission_desc")
                    : t("group_submission_desc")}
                </Text>
              </label>
            )}

            {/* Attachments */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                {t("attachments_label")}
              </Text>
              <FilePickerInput
                attachments={attachments}
                onAttachmentsChange={setAttachments}
              />
            </label>

            {/* Buttons */}
            <Flex gap="3" justify="end" mt="4">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">
                  {t("cancel")}
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                className="bg-mint-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("creating") : t("create")}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
