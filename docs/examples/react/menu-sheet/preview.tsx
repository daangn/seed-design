import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

const MenuSheetPreview = () => {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton>Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent aria-label="Menu Sheet">
        <MenuSheetGroup>
          <MenuSheetItem>
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 1
          </MenuSheetItem>
          <MenuSheetItem>
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 2
          </MenuSheetItem>
          <MenuSheetItem>
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 3
          </MenuSheetItem>
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem>
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 4
          </MenuSheetItem>
          <MenuSheetItem tone="critical">
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 5
          </MenuSheetItem>
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetPreview;
