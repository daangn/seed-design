import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
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
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent
        title="proident irure"
        description="Aliqua fugiat adipisicing magna dolor laborum."
        aria-label="Menu Sheet"
      >
        <MenuSheetGroup>
          <MenuSheetItem
            label="Action 1"
            description="Est commodo veniam magna officia ad dolor esse aliquip laboris nisi do."
            prefixIcon={<IconEyeSlashLine />}
          />
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

export default MenuSheetPreview;
