import { ResponsivePair } from "@seed-design/react";
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
} from "seed-design/ui/dialog";

const DialogConfirmBeforeClose = () => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <DialogRoot
        open={open}
        onOpenChange={(nextOpen, details) => {
          // 바깥 클릭은 기본적으로 닫히지 않습니다.
          // ESC 키로 닫으려 할 때만 바로 닫지 않고 확인 Dialog를 띄웁니다.
          if (!nextOpen && details?.reason === "escapeKeyDown") {
            setConfirmOpen(true);
            return;
          }

          setOpen(nextOpen);
        }}
      >
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">작성 폼 열기</ActionButton>
        </DialogTrigger>
        <DialogContent title="글 작성" description="ESC 키를 눌러 닫아보세요">
          <DialogBody>작성 중인 내용이 있을 때 실수로 닫는 것을 막습니다.</DialogBody>
          <DialogFooter>
            <DialogAction variant="neutralSolid">저장</DialogAction>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <AlertDialogRoot open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent layerIndex={10}>
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
