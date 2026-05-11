import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipableMenuSheetContent,
  SwipableMenuSheetGroup,
  SwipableMenuSheetItem,
  SwipableMenuSheetRoot,
  SwipableMenuSheetTrigger,
} from "seed-design/ui/swipable-menu-sheet";

const SwipableMenuSheetDismissible = () => {
  const [open, setOpen] = useState(false);

  return (
    <SwipableMenuSheetRoot open={open} onOpenChange={setOpen} dismissible={false}>
      <SwipableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipableMenuSheetTrigger>
      <SwipableMenuSheetContent title="Actions" aria-label="Swipable Menu Sheet">
        <SwipableMenuSheetGroup>
          <SwipableMenuSheetItem
            label="Action 1"
            prefixIcon={<IconEyeSlashLine />}
            onClick={() => setOpen(false)}
          />
          <SwipableMenuSheetItem
            label="Action 2"
            prefixIcon={<IconEyeSlashLine />}
            onClick={() => setOpen(false)}
          />
          <SwipableMenuSheetItem
            label="닫기"
            prefixIcon={<IconEyeSlashLine />}
            tone="critical"
            onClick={() => setOpen(false)}
          />
        </SwipableMenuSheetGroup>
      </SwipableMenuSheetContent>
    </SwipableMenuSheetRoot>
  );
};

export default SwipableMenuSheetDismissible;
