import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

export default function MenuSheetWithTitleAndDescription() {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent title="Menu Sheet" description="부가적인 설명이 여기에 표시됩니다.">
        <MenuSheetGroup>
          <MenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem
            label="Action 2"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
          <MenuSheetItem
            label="Action 3"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 5" prefixIcon={<IconEyeSlashLine />} tone="critical" />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
}
