import "./styles";

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "@/components/ui/bottom-sheet";
import { useState } from "@lynx-js/react";
import { ActionButton, VStack } from "@seed-design/lynx-react";

export default function Example() {
  const [open, setOpen] = useState(false);

  function scheduleOpen() {
    "background only";
    setTimeout(() => {
      setOpen(true);
    }, 1000);
  }

  return (
    <VStack gap="x3" style={{ width: "100%" }}>
      <ActionButton variant="neutralSolid" bindtap={scheduleOpen}>
        1초 후 열기
      </ActionButton>
      <BottomSheetRoot open={open} onOpenChange={setOpen}>
        <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
          <BottomSheetBody>
            <text className="bottom-sheet-preview__body-text">Content</text>
          </BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton variant="neutralSolid">확인</ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>
    </VStack>
  );
}
