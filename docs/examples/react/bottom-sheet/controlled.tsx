import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";

const BottomSheetControlled = () => {
  const [open, setOpen] = useState(false);

  const scheduleOpen = () => {
    setTimeout(() => {
      setOpen(true);
    }, 1000);
  };

  return (
    <>
      <ActionButton variant="neutralSolid" onClick={scheduleOpen}>
        1초 후 열기
      </ActionButton>
      <BottomSheetRoot open={open} onOpenChange={setOpen}>
        <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
          {/* If you need to omit padding, pass px={0}. */}
          <BottomSheetBody minHeight="x16">Content</BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton variant="neutralSolid">확인</ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>
    </>
  );
};

export default BottomSheetControlled;
