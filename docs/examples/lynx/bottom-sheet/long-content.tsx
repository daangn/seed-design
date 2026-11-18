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
      <BottomSheetContent
        title="긴 내용"
        description="화면 높이의 90%에서 멈추고 Body가 스크롤됩니다"
      >
        <BottomSheetBody>
          {Array.from({ length: 40 }, (_, index) => index + 1).map((line) => (
            <text key={line} className="bottom-sheet-preview__body-text">
              {line}. 내용이 길면 Body가 스크롤됩니다.
            </text>
          ))}
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
}
