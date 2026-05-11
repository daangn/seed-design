import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

export default function SwipeableMenuSheetWithTitleAndDescription() {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent
        title="Swipeable Menu Sheet"
        description="부가적인 설명이 여기에 표시됩니다."
      >
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem
            label="Action 2"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
          <SwipeableMenuSheetItem
            label="Action 3"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem
            label="Action 5"
            prefixIcon={<IconEyeSlashLine />}
            tone="critical"
          />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
}
