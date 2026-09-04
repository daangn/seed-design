import "./styles";

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { root } from "@lynx-js/react";
import { ActionButton, HStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <HStack className="bottom-sheet-preview" gap="x4">
        <BottomSheetRoot headerAlign="left">
          <BottomSheetTrigger>
            <ActionButton variant="neutralSolid">Left (기본값)</ActionButton>
          </BottomSheetTrigger>
          <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
            <BottomSheetBody className="bottom-sheet-preview__body">
              <text className="bottom-sheet-preview__body-text">Content</text>
            </BottomSheetBody>
            <BottomSheetFooter>
              <ActionButton variant="neutralSolid">확인</ActionButton>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheetRoot>

        <BottomSheetRoot headerAlign="center">
          <BottomSheetTrigger>
            <ActionButton variant="neutralSolid">Center</ActionButton>
          </BottomSheetTrigger>
          <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
            <BottomSheetBody className="bottom-sheet-preview__body">
              <text className="bottom-sheet-preview__body-text">Content</text>
            </BottomSheetBody>
            <BottomSheetFooter>
              <ActionButton variant="neutralSolid">확인</ActionButton>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheetRoot>
      </HStack>
    </page>
  );
}

root.render(<Root />);
