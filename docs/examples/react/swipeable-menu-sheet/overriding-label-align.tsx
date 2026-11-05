import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetOverridingLabelAlign = () => {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent aria-label="Swipeable Menu Sheet" labelAlign="center">
        <SwipeableMenuSheetGroup labelAlign="left">
          <SwipeableMenuSheetItem label="Action 1" />
          <SwipeableMenuSheetItem label="Action 2" labelAlign="center" />
          <SwipeableMenuSheetItem label="Action 3" />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 4" />
          <SwipeableMenuSheetItem label="Action 5" tone="critical" labelAlign="left" />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
};

export default SwipeableMenuSheetOverridingLabelAlign;
