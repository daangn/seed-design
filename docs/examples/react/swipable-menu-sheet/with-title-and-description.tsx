import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipableMenuSheetContent,
  SwipableMenuSheetGroup,
  SwipableMenuSheetItem,
  SwipableMenuSheetRoot,
  SwipableMenuSheetTrigger,
} from "seed-design/ui/swipable-menu-sheet";

export default function SwipableMenuSheetWithTitleAndDescription() {
  return (
    <SwipableMenuSheetRoot>
      <SwipableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipableMenuSheetTrigger>
      <SwipableMenuSheetContent
        title="Swipable Menu Sheet"
        description="부가적인 설명이 여기에 표시됩니다."
      >
        <SwipableMenuSheetGroup>
          <SwipableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <SwipableMenuSheetItem
            label="Action 2"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
          <SwipableMenuSheetItem
            label="Action 3"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
        </SwipableMenuSheetGroup>
        <SwipableMenuSheetGroup>
          <SwipableMenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <SwipableMenuSheetItem
            label="Action 5"
            prefixIcon={<IconEyeSlashLine />}
            tone="critical"
          />
        </SwipableMenuSheetGroup>
      </SwipableMenuSheetContent>
    </SwipableMenuSheetRoot>
  );
}
