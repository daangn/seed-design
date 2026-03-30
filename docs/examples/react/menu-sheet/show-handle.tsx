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

const MenuSheetShowHandle = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <MenuSheetRoot open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent title="Actions" aria-label="Menu Sheet" showHandle>
        <MenuSheetGroup>
          <MenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetShowHandle;
