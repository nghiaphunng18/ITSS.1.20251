"use client";

import { useState } from "react";
import {
  Dialog,
  Button,
  Flex,
  Text,
  TextField,
  TextArea,
  Checkbox,
} from "@radix-ui/themes";
import { FiPlus, FiLock } from "react-icons/fi";
import { useTranslations } from "next-intl";

// Generate random 8-character class code
function generateClassCode(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@$&*!";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: {
    code: string;
    name: string;
    description: string;
    semester: string;
    year: number;
    isPrivate: boolean;
    joinCode?: string;
  }) => Promise<void>;
}

export function CreateClassDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateClassDialogProps) {
  const t = useTranslations("classes.create");
  const tCommon = useTranslations("common.actions");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    semester: "",
    year: new Date().getFullYear(),
    isPrivate: false,
    joinCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: any = {
      ...formData,
      code: generateClassCode(),
    };
    if (submitData.isPrivate) {
      submitData.joinCode = generateClassCode();
    } else {
      delete submitData.joinCode;
    }
    await onSubmit(submitData);
    setFormData({
      name: "",
      description: "",
      semester: "",
      year: new Date().getFullYear(),
      isPrivate: false,
      joinCode: "",
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        <Dialog.Title>{t("dialog_title")}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {t("dialog_description")}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                {t("form_name_label")}
              </Text>
              <TextField.Root
                placeholder={t("form_name_placeholder")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                {t("form_description_label")}
              </Text>
              <TextArea
                placeholder={t("form_description_placeholder")}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </label>

            <Flex gap="4">
              <label style={{ flex: 1 }}>
                <Text as="div" size="2" mb="1" weight="bold">
                  {t("form_semester_label")}
                </Text>
                <TextField.Root
                  placeholder="Fall 2024"
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({ ...formData, semester: e.target.value })
                  }
                />
              </label>
              <label style={{ flex: 1 }}>
                <Text as="div" size="2" mb="1" weight="bold">
                  {t("form_year_label")}
                </Text>
                <TextField.Root
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year: parseInt(e.target.value) || new Date().getFullYear(),
                    })
                  }
                />
              </label>
            </Flex>

            <label>
              <Flex align="center" gap="2">
                <Checkbox
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      isPrivate: checked === true,
                    })
                  }
                />
                <Flex align="center" gap="2">
                  <FiLock size={14} />
                  <Text size="2" weight="bold">
                    {t("form_private_label")}
                  </Text>
                </Flex>
              </Flex>
              <Text size="1" className="text-gray-500 ml-6 mt-1 block">
                {t("form_private_note")}
              </Text>
            </label>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">
                  {tCommon("cancel")}
                </Button>
              </Dialog.Close>
              <Button type="submit" className="bg-mint-500">
                <FiPlus size={16} /> {t("create")}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
