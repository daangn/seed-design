import { HStack, ResponsivePair, VStack } from "@seed-design/react";
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

const DialogConfirmBeforeClose = () => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmReasons, setConfirmReasons] = useState<
    Record<(typeof closeReasons)[number], boolean>
  >({ closeButton: true, escapeKeyDown: true, interactOutside: true });

  return (
    <>
      <DialogRoot
        open={open}
        closeOnInteractOutside
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
        <DialogContent title="글 작성" description="스위치를 켠 방식으로 닫아보세요">
          <DialogBody>
            <VStack>
              {closeReasons.map((reason) => (
                <Switch
                  key={reason}
                  label={reason}
                  size="16"
                  checked={confirmReasons[reason]}
                  onCheckedChange={(checked) =>
                    setConfirmReasons((prev) => ({ ...prev, [reason]: checked }))
                  }
                />
              ))}
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
