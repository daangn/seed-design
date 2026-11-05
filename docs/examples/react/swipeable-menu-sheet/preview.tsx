import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetPreview = () => {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent
        title="proident irure"
        description="Aliqua fugiat adipisicing magna dolor laborum."
        aria-label="Swipeable Menu Sheet"
      >
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem
            label="Action 1"
            description="Est commodo veniam magna officia ad dolor esse aliquip laboris nisi do."
            prefixIcon={<IconEyeSlashLine />}
          />
          <SwipeableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
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

export default SwipeableMenuSheetPreview;
