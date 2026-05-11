import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipableMenuSheetContent,
  SwipableMenuSheetGroup,
  SwipableMenuSheetItem,
  SwipableMenuSheetRoot,
  SwipableMenuSheetTrigger,
} from "seed-design/ui/swipable-menu-sheet";

const SwipableMenuSheetOverridingLabelAlign = () => {
  return (
    <SwipableMenuSheetRoot>
      <SwipableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipableMenuSheetTrigger>
      <SwipableMenuSheetContent aria-label="Swipable Menu Sheet" labelAlign="center">
        <SwipableMenuSheetGroup labelAlign="left">
          <SwipableMenuSheetItem label="Action 1" />
          <SwipableMenuSheetItem label="Action 2" labelAlign="center" />
          <SwipableMenuSheetItem label="Action 3" />
        </SwipableMenuSheetGroup>
        <SwipableMenuSheetGroup>
          <SwipableMenuSheetItem label="Action 4" />
          <SwipableMenuSheetItem label="Action 5" tone="critical" labelAlign="left" />
        </SwipableMenuSheetGroup>
      </SwipableMenuSheetContent>
    </SwipableMenuSheetRoot>
  );
};

export default SwipableMenuSheetOverridingLabelAlign;
