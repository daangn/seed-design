import { HStack, ResponsivePair, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
} from "seed-design/ui/alert-dialog";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
  type DialogRootProps,
} from "seed-design/ui/dialog";
import { Switch } from "seed-design/ui/switch";

const closeReasons = [
  "closeButton",
  "escapeKeyDown",
  "interactOutside",
] as const satisfies NonNullable<
  Parameters<NonNullable<DialogRootProps["onOpenChange"]>>[1]
>["reason"][];

const confirmReasonLabels = {
  closeButton: "닫기 버튼으로 닫을 때 확인 (closeButton)",
  escapeKeyDown: "ESC 키로 닫을 때 확인 (escapeKeyDown)",
  interactOutside: "바깥 클릭으로 닫을 때 확인 (interactOutside)",
} as const satisfies Record<(typeof closeReasons)[number], string>;

const DialogConfirmBeforeClose = () => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [closeOnInteractOutside, setCloseOnInteractOutside] = useState(true);
  const [confirmReasons, setConfirmReasons] = useState<
    Record<(typeof closeReasons)[number], boolean>
  >({ closeButton: true, escapeKeyDown: true, interactOutside: true });

  return (
    <>
      <DialogRoot
        open={open}
        closeOnInteractOutside={closeOnInteractOutside}
        onOpenChange={(nextOpen, details) => {
          if (nextOpen) {
            setOpen(true);

            return;
          }

          const reason = closeReasons.find((reason) => reason === details?.reason);

          if (reason && confirmReasons[reason]) {
            setConfirmOpen(true);

            return;
          }

          setOpen(false);
        }}
      >
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">작성 폼 열기</ActionButton>
        </DialogTrigger>
        <DialogContent
          title="글 작성"
          description="닫기 동작을 바꿔가며 확인 다이얼로그를 띄워보세요"
        >
          <DialogBody>
            <VStack align="flex-start" gap="x4">
              <Switch
                label="바깥 클릭으로 닫기 (closeOnInteractOutside)"
                tone="brand"
                size="16"
                checked={closeOnInteractOutside}
                onCheckedChange={setCloseOnInteractOutside}
              />
              <VStack align="flex-start" gap="x2">
                <Text fontSize="t3" color="fg.neutralMuted">
                  닫으려는 reason별로 확인 다이얼로그 띄우기
                </Text>
                {closeReasons.map((reason) => (
                  <Switch
                    key={reason}
                    label={confirmReasonLabels[reason]}
                    tone="neutral"
                    size="16"
                    checked={confirmReasons[reason]}
                    onCheckedChange={(checked) =>
                      setConfirmReasons((prev) => ({ ...prev, [reason]: checked }))
                    }
                  />
                ))}
              </VStack>
            </VStack>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">저장</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <AlertDialogRoot open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 닫을까요?</AlertDialogTitle>
            <AlertDialogDescription>작성 중인 내용은 저장되지 않습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ResponsivePair gap="x2">
              <AlertDialogAction variant="neutralWeak" onClick={() => setConfirmOpen(false)}>
                계속 작성
              </AlertDialogAction>
              <AlertDialogAction
                variant="criticalSolid"
                onClick={() => {
                  setConfirmOpen(false);
                  setOpen(false);
                }}
              >
                닫기
              </AlertDialogAction>
            </ResponsivePair>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    </>
  );
};

export default DialogConfirmBeforeClose;
