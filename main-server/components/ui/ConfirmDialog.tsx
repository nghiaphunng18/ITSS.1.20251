import { Dialog, Button, Flex } from "@radix-ui/themes";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: "red" | "blue" | "green";
  trigger?: ReactNode;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel,
  cancelLabel,
  confirmColor = "red",
  trigger,
}: ConfirmDialogProps) {
  const tConfirm = useTranslations('confirm');
  
  const finalConfirmLabel = confirmLabel || tConfirm("default_confirm");
  const finalCancelLabel = cancelLabel || tConfirm("default_cancel");
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger>{trigger}</Dialog.Trigger>}
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {description}
        </Dialog.Description>
        <Flex gap="3" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              {finalCancelLabel}
            </Button>
          </Dialog.Close>
          <Button color={confirmColor} onClick={onConfirm}>
            {finalConfirmLabel}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
