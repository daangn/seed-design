import {
  ActionSheetContent,
  ActionSheetItem,
  ActionSheetRoot,
  ActionSheetTrigger,
} from "seed-design/ui/action-sheet";
import { ActionButton } from "seed-design/ui/action-button";

const ActionSheetPreview = () => {
  return (
    <ActionSheetRoot>
      <ActionSheetTrigger asChild>
        <ActionButton>Open</ActionButton>
      </ActionSheetTrigger>
      <ActionSheetContent aria-label="Action Sheet">
        <ActionSheetItem label="Action 1" />
        <ActionSheetItem label="Action 2" />
        <ActionSheetItem tone="critical" label="Action 3" />
      </ActionSheetContent>
    </ActionSheetRoot>
  );
};

export default ActionSheetPreview;
