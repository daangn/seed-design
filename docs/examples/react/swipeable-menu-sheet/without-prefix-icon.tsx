import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetWithoutPrefixIcon = () => {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent aria-label="Swipeable Menu Sheet" labelAlign="center">
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 1" />
          <SwipeableMenuSheetItem label="Action 2" />
          <SwipeableMenuSheetItem label="Action 3" />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 4" />
          <SwipeableMenuSheetItem label="Action 5" tone="critical" />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
};

export default SwipeableMenuSheetWithoutPrefixIcon;
