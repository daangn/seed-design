import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetWithTitle = () => {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent title="Swipeable Menu Sheet">
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
};

export default SwipeableMenuSheetWithTitle;
