import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetControlled = () => {
  const [open, setOpen] = useState(false);

  const scheduleOpen = () => {
    setTimeout(() => {
      setOpen(true);
    }, 1000);
  };

  return (
    <>
      <ActionButton variant="neutralSolid" onClick={scheduleOpen}>
        1초 후 열기
      </ActionButton>
      <SwipeableMenuSheetRoot open={open} onOpenChange={setOpen}>
        <SwipeableMenuSheetContent title="메뉴" aria-label="Swipeable Menu Sheet">
          <SwipeableMenuSheetGroup>
            <SwipeableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
            <SwipeableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
            <SwipeableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
          </SwipeableMenuSheetGroup>
        </SwipeableMenuSheetContent>
      </SwipeableMenuSheetRoot>
    </>
  );
};

export default SwipeableMenuSheetControlled;
