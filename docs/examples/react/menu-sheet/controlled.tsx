import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
} from "seed-design/ui/menu-sheet";

const MenuSheetControlled = () => {
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
      <MenuSheetRoot open={open} onOpenChange={setOpen}>
        <MenuSheetContent title="Actions" aria-label="Menu Sheet">
          <MenuSheetGroup>
            <MenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
            <MenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
            <MenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
          </MenuSheetGroup>
        </MenuSheetContent>
      </MenuSheetRoot>
    </>
  );
};

export default MenuSheetControlled;
