import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetSkipAnimation = () => {
  return (
    <SwipeableMenuSheetRoot skipAnimation>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent aria-label="Swipeable Menu Sheet">
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
};

export default SwipeableMenuSheetSkipAnimation;
