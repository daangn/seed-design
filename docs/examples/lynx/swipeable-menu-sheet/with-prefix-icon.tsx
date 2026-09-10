import "./styles";

import IconEyeSlashLine from "@karrotmarket/lynx-monochrome-icon/IconEyeSlashLine";
import { ActionButton, useSeedClassName, VStack } from "@seed-design/lynx-react";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "@/components/ui/swipeable-menu-sheet";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-swipeable-menu-sheet-root`}>
      <VStack className="swipeable-menu-sheet-preview" gap="x3">
        <SwipeableMenuSheetRoot>
          <SwipeableMenuSheetTrigger>
            <ActionButton variant="neutralSolid">메뉴 열기</ActionButton>
          </SwipeableMenuSheetTrigger>
          <SwipeableMenuSheetContent accessibility-label="아이콘이 있는 메뉴">
            <SwipeableMenuSheetGroup>
              <SwipeableMenuSheetItem label="게시글 숨기기" prefixIcon={<IconEyeSlashLine />} />
              <SwipeableMenuSheetItem label="알림 끄기" prefixIcon={<IconEyeSlashLine />} />
              <SwipeableMenuSheetItem label="관심 없음" prefixIcon={<IconEyeSlashLine />} />
            </SwipeableMenuSheetGroup>
            <SwipeableMenuSheetGroup>
              <SwipeableMenuSheetItem label="게시글 신고하기" prefixIcon={<IconEyeSlashLine />} />
              <SwipeableMenuSheetItem
                label="게시글 삭제하기"
                prefixIcon={<IconEyeSlashLine />}
                tone="critical"
              />
            </SwipeableMenuSheetGroup>
          </SwipeableMenuSheetContent>
        </SwipeableMenuSheetRoot>
      </VStack>
    </view>
  );
}
