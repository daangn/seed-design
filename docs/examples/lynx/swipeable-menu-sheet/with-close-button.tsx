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
          <SwipeableMenuSheetContent title="닫기 버튼이 있는 메뉴" showCloseButton>
            <SwipeableMenuSheetGroup>
              <SwipeableMenuSheetItem label="숨기기" prefixIcon={<IconEyeSlashLine />} />
            </SwipeableMenuSheetGroup>
          </SwipeableMenuSheetContent>
        </SwipeableMenuSheetRoot>
      </VStack>
    </view>
  );
}
