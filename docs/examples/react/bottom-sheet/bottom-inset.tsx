import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

const BottomSheetBottomInset = () => {
  return (
    <BottomSheetRoot>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent
        title="제목"
        description="설명을 작성할 수 있어요"
        // 모바일 브라우저에서 아래 여백을 주기 위해 사용
        style={{ paddingBottom: "var(--seed-safe-area-bottom)" }}
      >
        {/* If you need to omit padding, pass px={0}. */}
        <BottomSheetBody minHeight="x16">Content</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default BottomSheetBottomInset;
