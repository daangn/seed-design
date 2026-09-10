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

type OpenChangeReason = "trigger" | "closeButton" | "interactOutside" | "drag";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<OpenChangeReason | null>(null);
  const [closeReason, setCloseReason] = useState<OpenChangeReason | null>(null);

  function handleOpenChange(nextOpen: boolean, details: { reason: OpenChangeReason }) {
    "background only";
    setOpen(nextOpen);

    if (nextOpen) {
      setOpenReason(details.reason);
    } else {
      setCloseReason(details.reason);
    }
  }

  return (
    <view className={`${seedClassName} docs-lynx-swipeable-menu-sheet-root`}>
      <VStack className="swipeable-menu-sheet-preview" gap="x3">
        <text className="swipeable-menu-sheet-preview__status">
          {open ? "열림 상태: true" : "열림 상태: false"}
        </text>
        <text className="swipeable-menu-sheet-preview__status">
          마지막 열림 이유: {openReason ?? "-"}
        </text>
        <text className="swipeable-menu-sheet-preview__status">
          마지막 닫힘 이유: {closeReason ?? "-"}
        </text>
        <SwipeableMenuSheetRoot open={open} onOpenChange={handleOpenChange}>
          <SwipeableMenuSheetTrigger>
            <ActionButton variant="neutralSolid">메뉴 열기</ActionButton>
          </SwipeableMenuSheetTrigger>
          <SwipeableMenuSheetContent title="메뉴" showCloseButton>
            <SwipeableMenuSheetGroup>
              <SwipeableMenuSheetItem label="숨기기" prefixIcon={<IconEyeSlashLine />} />
            </SwipeableMenuSheetGroup>
          </SwipeableMenuSheetContent>
        </SwipeableMenuSheetRoot>
      </VStack>
    </view>
  );
}
