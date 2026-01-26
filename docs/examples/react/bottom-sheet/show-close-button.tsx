import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetShowCloseButton = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <BottomSheetRoot open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent
        title="제목"
        description="설명을 작성할 수 있어요"
        showCloseButton={false}
      >
        {/* If you need to omit padding, pass px={0}. */}
        <BottomSheetBody minHeight="x16">Content</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid" onClick={() => setIsSheetOpen(false)}>
            닫기
          </ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetShowCloseButton;
