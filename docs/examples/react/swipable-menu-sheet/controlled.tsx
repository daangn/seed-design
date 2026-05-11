import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipableMenuSheetContent,
  SwipableMenuSheetGroup,
  SwipableMenuSheetItem,
  SwipableMenuSheetRoot,
} from "seed-design/ui/swipable-menu-sheet";

const SwipableMenuSheetControlled = () => {
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
      <SwipableMenuSheetRoot open={open} onOpenChange={setOpen}>
        <SwipableMenuSheetContent title="메뉴" aria-label="Swipable Menu Sheet">
          <SwipableMenuSheetGroup>
            <SwipableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
            <SwipableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
            <SwipableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
          </SwipableMenuSheetGroup>
        </SwipableMenuSheetContent>
      </SwipableMenuSheetRoot>
    </>
  );
};

export default SwipableMenuSheetControlled;
