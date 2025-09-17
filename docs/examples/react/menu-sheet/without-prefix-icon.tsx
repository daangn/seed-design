import { ActionButton } from "@/registry/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "@/registry/ui/menu-sheet";

const MenuSheetWithoutPrefixIcon = () => {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton>Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent aria-label="Menu Sheet" labelAlign="center">
        <MenuSheetGroup>
          <MenuSheetItem>Action 1</MenuSheetItem>
          <MenuSheetItem>Action 2</MenuSheetItem>
          <MenuSheetItem>Action 3</MenuSheetItem>
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem>Action 4</MenuSheetItem>
          <MenuSheetItem tone="critical">Action 5</MenuSheetItem>
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetWithoutPrefixIcon;
