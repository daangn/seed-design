import "./styles";

import IconEyeSlashLine from "@karrotmarket/lynx-monochrome-icon/IconEyeSlashLine";
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
          <SwipeableMenuSheetContent title="게시글 관리" description="원하는 작업을 선택해 주세요.">
            <SwipeableMenuSheetGroup>
              <SwipeableMenuSheetItem label="수정하기" prefixIcon={<IconEyeSlashLine />} />
              <SwipeableMenuSheetItem
                label="공유하기"
                prefixIcon={<IconEyeSlashLine />}
                description="친구에게 게시글을 공유할 수 있어요."
              />
              <SwipeableMenuSheetItem
                label="끌어올리기"
                prefixIcon={<IconEyeSlashLine />}
                description="게시글을 다시 상단에 표시해요."
              />
            </SwipeableMenuSheetGroup>
            <SwipeableMenuSheetGroup>
              <SwipeableMenuSheetItem label="숨기기" prefixIcon={<IconEyeSlashLine />} />
              <SwipeableMenuSheetItem
                label="삭제하기"
                prefixIcon={<IconEyeSlashLine />}
                tone="critical"
              />
            </SwipeableMenuSheetGroup>
          </SwipeableMenuSheetContent>
        </SwipeableMenuSheetRoot>
      </VStack>
    </page>
  );
}

root.render(<Root />);
