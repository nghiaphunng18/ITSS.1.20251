"use client";

import { useState } from "react";
import {
  Dialog,
  Button,
  Flex,
  Text,
  TextField,
  TextArea,
  Select,
} from "@radix-ui/themes";
import { FiPlus } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { FilePickerInput, FileAttachment } from "./FilePickerInput";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: {
    title: string;
    content: string;
    type: string;
    attachments?: FileAttachment[];
  }) => Promise<void>;
}

export function CreatePostDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreatePostDialogProps) {
  const t = useTranslations("posts.create");
  const tCommon = useTranslations("common.actions");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "DISCUSSION",
  });
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
      setFormData({
        title: "",
        content: "",
        type: "DISCUSSION",
      });
      setAttachments([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 600 }}>
        <Dialog.Title>{t("dialog_title")}</Dialog.Title>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3" className="mt-4">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                {t("form_type_label")}
              </Text>
              <Select.Root
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="ANNOUNCEMENT">{t("form_type_announcement")}</Select.Item>
                  <Select.Item value="DISCUSSION">{t("form_type_discussion")}</Select.Item>
                  <Select.Item value="MATERIAL">{t("form_type_material")}</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                {t("form_title_label")}
              </Text>
              <TextField.Root
                placeholder={t("form_title_placeholder")}
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                required
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                {t("form_content_label")}
              </Text>
              <TextArea
                placeholder={t("form_content_placeholder")}
                value={formData.content}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: e.target.value,
                  })
                }
                style={{ minHeight: "200px" }}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                {t("form_attachments_label")}
              </Text>
              <FilePickerInput
                attachments={attachments}
                onAttachmentsChange={setAttachments}
              />
            </label>

            <Flex gap="3" justify="end" mt="4">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">
                  {tCommon("cancel")}
                </Button>
              </Dialog.Close>
              <Button 
                type="submit" 
                className="bg-mint-500"
                disabled={isSubmitting}
              >
                <FiPlus size={16} /> {isSubmitting ? t("creating") : t("create")}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
