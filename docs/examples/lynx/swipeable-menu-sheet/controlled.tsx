import "./styles";

import IconEyeSlashLine from "@karrotmarket/lynx-monochrome-icon/IconEyeSlashLine";
import { useState } from "@lynx-js/react";
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
  const [open, setOpen] = useState(false);

  function handleOpen() {
    "background only";
    setOpen(true);
  }

  function handleOpenChange(nextOpen: boolean) {
    "background only";
    setOpen(nextOpen);
  }

  return (
    <view className={`${seedClassName} docs-lynx-swipeable-menu-sheet-root`}>
      <VStack className="swipeable-menu-sheet-preview" gap="x3">
        <text className="swipeable-menu-sheet-preview__status">
          {open ? "열림 상태: true" : "열림 상태: false"}
        </text>
        <ActionButton variant="neutralWeak" bindtap={handleOpen} disabled={open}>
          상태로 열기
        </ActionButton>
        <SwipeableMenuSheetRoot open={open} onOpenChange={handleOpenChange}>
          <SwipeableMenuSheetTrigger>
            <ActionButton variant="neutralSolid">메뉴 열기</ActionButton>
          </SwipeableMenuSheetTrigger>
          <SwipeableMenuSheetContent title="제어되는 메뉴">
            <SwipeableMenuSheetGroup>
              <SwipeableMenuSheetItem label="숨기기" prefixIcon={<IconEyeSlashLine />} />
            </SwipeableMenuSheetGroup>
          </SwipeableMenuSheetContent>
        </SwipeableMenuSheetRoot>
      </VStack>
    </view>
  );
}
