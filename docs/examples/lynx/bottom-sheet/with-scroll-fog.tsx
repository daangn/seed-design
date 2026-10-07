import "./styles";

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";

import { ActionButton, ScrollFog, VStack } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <BottomSheetRoot>
      <BottomSheetTrigger>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
        <BottomSheetBody className="bottom-sheet-preview__scroll-fog-body">
          <ScrollFog placement={["top", "bottom"]} style={{ width: "100%", height: "100%" }}>
            <scroll-view
              className="bottom-sheet-preview__scroll-fog-content"
              scroll-orientation="vertical"
              scroll-bar-enable={false}
              style={{ width: "100%", height: "100%" }}
            >
              <VStack className="bottom-sheet-preview__blocks" gap="x4">
                <view className="bottom-sheet-preview__block" />
                <view className="bottom-sheet-preview__block" />
                <view className="bottom-sheet-preview__block" />
                <view className="bottom-sheet-preview__block" />
              </VStack>
            </scroll-view>
          </ScrollFog>
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
}
