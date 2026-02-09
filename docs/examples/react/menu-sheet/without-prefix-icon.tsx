import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

const MenuSheetWithoutPrefixIcon = () => {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent aria-label="Menu Sheet" labelAlign="center">
        <MenuSheetGroup>
          <MenuSheetItem label="Action 1" />
          <MenuSheetItem label="Action 2" />
          <MenuSheetItem label="Action 3" />
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem label="Action 4" />
          <MenuSheetItem label="Action 5" tone="critical" />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetWithoutPrefixIcon;
