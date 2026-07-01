import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "seed-design/ui/dialog";

const DialogControlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ActionButton variant="neutralSolid" onClick={() => setOpen(true)}>
        열기
      </ActionButton>
      <DialogRoot open={open} onOpenChange={setOpen}>
        <DialogContent title="제목" description="설명을 작성할 수 있어요">
          <DialogBody>
            외부 상태로 Dialog를 열고 닫을 때도 본문과 푸터 구조는 동일하게 유지됩니다.
          </DialogBody>
          <DialogFooter>
            <DialogAction variant="neutralSolid">확인</DialogAction>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default DialogControlled;
