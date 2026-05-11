import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipableMenuSheetContent,
  SwipableMenuSheetGroup,
  SwipableMenuSheetItem,
  SwipableMenuSheetRoot,
  SwipableMenuSheetTrigger,
} from "seed-design/ui/swipable-menu-sheet";

const SwipableMenuSheetWithPrefixIcon = () => {
  return (
    <SwipableMenuSheetRoot>
      <SwipableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipableMenuSheetTrigger>
      <SwipableMenuSheetContent aria-label="Swipable Menu Sheet">
        <SwipableMenuSheetGroup>
          <SwipableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <SwipableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <SwipableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
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
};

export default SwipableMenuSheetWithPrefixIcon;
