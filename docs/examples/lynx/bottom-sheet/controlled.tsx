import { root, useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName } from "@seed-design/lynx-react";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "@/components/ui/bottom-sheet";
import "./styles";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);
  function scheduleOpen() {
    "background only";
    setTimeout(() => setOpen(true), 1000);
  }
  function close() {
    "background only";
    setOpen(false);
  }
  return (
    <page className={seedClassName}>
      <view className="bottom-sheet-preview">
        <ActionButton variant="neutralSolid" bindtap={scheduleOpen}>
          1초 후 열기
        </ActionButton>
        <BottomSheetRoot open={open} onOpenChange={setOpen}>
          <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
            <BottomSheetBody className="bottom-sheet-preview__body">
              <text>Content</text>
            </BottomSheetBody>
            <BottomSheetFooter>
              <ActionButton variant="neutralSolid" bindtap={close}>
                닫기
              </ActionButton>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheetRoot>
      </view>
    </page>
  );
}
root.render(<Root />);
