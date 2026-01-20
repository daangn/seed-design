import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

const MenuSheetOverridingLabelAlign = () => {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent aria-label="Menu Sheet" labelAlign="center">
        <MenuSheetGroup labelAlign="left">
          <MenuSheetItem label="Action 1" />
          <MenuSheetItem label="Action 2" labelAlign="center" />
          <MenuSheetItem label="Action 3" />
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem label="Action 4" />
          <MenuSheetItem label="Action 5" tone="critical" labelAlign="left" />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetOverridingLabelAlign;
