import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

const MenuSheetWithPrefixIcon = () => {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent aria-label="Menu Sheet">
        <MenuSheetGroup>
          <MenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 5" prefixIcon={<IconEyeSlashLine />} tone="critical" />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetWithPrefixIcon;
