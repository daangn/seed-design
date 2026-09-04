import "./styles";

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { root } from "@lynx-js/react";
import { ActionButton, useSeedClassName, VStack } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="bottom-sheet-preview">
        <BottomSheetRoot>
          <BottomSheetTrigger>
            <ActionButton variant="neutralSolid">Open</ActionButton>
          </BottomSheetTrigger>
          <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
            <BottomSheetBody style={{ height: "300px", maxHeight: "300px", flex: "none" }}>
              <VStack className="bottom-sheet-preview__blocks" gap="x4">
                <view className="bottom-sheet-preview__block" />
                <view className="bottom-sheet-preview__block" />
                <view className="bottom-sheet-preview__block" />
                <view className="bottom-sheet-preview__block" />
              </VStack>
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
