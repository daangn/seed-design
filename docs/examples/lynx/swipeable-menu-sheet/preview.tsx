import "./styles";

import { root, useState } from "@lynx-js/react";
import { ActionButton, useSeedClassName, VStack } from "@seed-design/lynx-react";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "@/components/ui/swipeable-menu-sheet";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    "background only";
    setOpen(nextOpen);
  }

  return (
    <page className={seedClassName}>
      <VStack className="swipeable-menu-sheet-preview" gap="x3">
        <text className="swipeable-menu-sheet-preview__status">
          {open ? "열림: true" : "열림: false"}
        </text>
        <SwipeableMenuSheetRoot open={open} onOpenChange={handleOpenChange}>
          <SwipeableMenuSheetTrigger>
            <ActionButton variant="neutralSolid">메뉴 열기</ActionButton>
          </SwipeableMenuSheetTrigger>
          <SwipeableMenuSheetContent title="게시글 관리" description="원하는 작업을 선택해 주세요.">
            <SwipeableMenuSheetGroup>
              <SwipeableMenuSheetItem label="수정하기" />
              <SwipeableMenuSheetItem
                label="공유하기"
                description="친구에게 게시글을 공유할 수 있어요."
              />
              <SwipeableMenuSheetItem label="끌어올리기" />
            </SwipeableMenuSheetGroup>
            <SwipeableMenuSheetGroup>
              <SwipeableMenuSheetItem label="숨기기" />
              <SwipeableMenuSheetItem label="삭제하기" tone="critical" />
            </SwipeableMenuSheetGroup>
          </SwipeableMenuSheetContent>
        </SwipeableMenuSheetRoot>
      </VStack>
    </page>
  );
}

root.render(<Root />);
