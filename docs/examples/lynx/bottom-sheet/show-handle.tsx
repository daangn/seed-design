import "./styles";

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { useState } from "@lynx-js/react";
import { ActionButton } from "@seed-design/lynx-react";

export default function Example() {
  const [open, setOpen] = useState(false);

  function handleClose() {
    "background only";
    setOpen(false);
  }

  return (
    <BottomSheetRoot open={open} onOpenChange={setOpen}>
      <BottomSheetTrigger>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="제목" description="설명을 작성할 수 있어요" showHandle>
        <BottomSheetBody>
          <text className="bottom-sheet-preview__body-text">Content</text>
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid" bindtap={handleClose}>
            닫기
          </ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
}
