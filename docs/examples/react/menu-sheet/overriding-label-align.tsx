import { ActionButton } from "@/registry/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "@/registry/ui/menu-sheet";

const MenuSheetOverridingLabelAlign = () => {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton>Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent aria-label="Menu Sheet" labelAlign="center">
        <MenuSheetGroup labelAlign="left">
          <MenuSheetItem>Action 1</MenuSheetItem>
          <MenuSheetItem labelAlign="center">Action 2</MenuSheetItem>
          <MenuSheetItem>Action 3</MenuSheetItem>
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem>Action 4</MenuSheetItem>
          <MenuSheetItem tone="critical" labelAlign="left">
            Action 5
          </MenuSheetItem>
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetOverridingLabelAlign;
