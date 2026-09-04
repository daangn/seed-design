import "./styles";

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "@/components/ui/bottom-sheet";
import { root, useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName, VStack } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);

  function scheduleOpen() {
    "background only";
    setTimeout(() => {
      setOpen(true);
    }, 1000);
  }

  return (
    <page className={seedClassName}>
      <VStack className="bottom-sheet-preview">
        <ActionButton variant="neutralSolid" bindtap={scheduleOpen}>
          1초 후 열기
        </ActionButton>
        <BottomSheetRoot open={open} onOpenChange={setOpen}>
          <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
            <BottomSheetBody className="bottom-sheet-preview__body">
              <text className="bottom-sheet-preview__body-text">Content</text>
            </BottomSheetBody>
            <BottomSheetFooter>
              <ActionButton variant="neutralSolid">확인</ActionButton>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheetRoot>
      </VStack>
    </page>
  );
}

root.render(<Root />);
