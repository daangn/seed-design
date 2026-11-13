import "./styles";

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";

import { ActionButton } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <BottomSheetRoot>
      <BottomSheetTrigger>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent container="window" overlayLevel={2} title="Overlay">
        <BottomSheetBody>
          <text className="bottom-sheet-preview__body-text">
            시트는 window 컨테이너와 overlay level 2 위에 표시됩니다.
          </text>
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
}
