import { HStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetHeaderAlign = () => {
  return (
    <HStack gap="x4">
      <BottomSheetRoot headerAlign="left">
        <BottomSheetTrigger asChild>
          <ActionButton>Left (기본값)</ActionButton>
        </BottomSheetTrigger>
        <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
          <BottomSheetBody>Content</BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton variant="neutralSolid">확인</ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>

      <BottomSheetRoot headerAlign="center">
        <BottomSheetTrigger asChild>
          <ActionButton>Center</ActionButton>
        </BottomSheetTrigger>
        <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
          <BottomSheetBody>Content</BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton variant="neutralSolid">확인</ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>
    </HStack>
  );
};

export default BottomSheetHeaderAlign;
