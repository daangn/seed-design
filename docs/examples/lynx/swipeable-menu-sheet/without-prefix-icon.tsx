import "./styles";

import { root } from "@lynx-js/react";
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

  return (
    <page className={seedClassName}>
      <VStack className="swipeable-menu-sheet-preview" gap="x3">
        <SwipeableMenuSheetRoot>
          <SwipeableMenuSheetTrigger>
            <ActionButton variant="neutralSolid">메뉴 열기</ActionButton>
          </SwipeableMenuSheetTrigger>
          <SwipeableMenuSheetContent accessibility-label="아이콘이 없는 메뉴" labelAlign="center">
            <SwipeableMenuSheetGroup>
              <SwipeableMenuSheetItem label="게시글 수정하기" />
              <SwipeableMenuSheetItem label="게시글 공유하기" />
              <SwipeableMenuSheetItem label="게시글 끌어올리기" />
            </SwipeableMenuSheetGroup>
            <SwipeableMenuSheetGroup>
              <SwipeableMenuSheetItem label="게시글 숨기기" />
              <SwipeableMenuSheetItem label="게시글 삭제하기" tone="critical" />
            </SwipeableMenuSheetGroup>
          </SwipeableMenuSheetContent>
        </SwipeableMenuSheetRoot>
      </VStack>
    </page>
  );
}

root.render(<Root />);
