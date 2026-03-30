import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

const MenuSheetDismissible = () => {
  const [open, setOpen] = useState(false);

  return (
    <MenuSheetRoot open={open} onOpenChange={setOpen} dismissible={false}>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent title="Actions" aria-label="Menu Sheet">
        <MenuSheetGroup>
          <MenuSheetItem
            label="Action 1"
            prefixIcon={<IconEyeSlashLine />}
            onClick={() => setOpen(false)}
          />
          <MenuSheetItem
            label="Action 2"
            prefixIcon={<IconEyeSlashLine />}
            onClick={() => setOpen(false)}
          />
          <MenuSheetItem
            label="닫기"
            prefixIcon={<IconEyeSlashLine />}
            tone="critical"
            onClick={() => setOpen(false)}
          />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetDismissible;
