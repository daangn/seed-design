import { useActivity, type ActivityComponentType } from "@stackflow/react";

import {
  ActionSheetContent,
  ActionSheetItem,
  ActionSheetRoot,
} from "../seed-design/ui/action-sheet";
import { createCallbackActivity } from "../stackflow/createCallbackActivity";

type Action = "add" | "edit" | "delete";

export const actionSheetCallback = createCallbackActivity(
  "ActivityActionSheet",
  {} as { action: Action },
);

const ActivityActionSheet: ActivityComponentType = () => {
  const { pop } = actionSheetCallback.useCallbackPop();
  const activity = useActivity();

  const handleAction = (action: Action) => () => {
    pop({ action });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      pop();
    }
  };

  return (
    <ActionSheetRoot open={activity.isActive} onOpenChange={handleClose}>
      <ActionSheetContent
        layerIndex={activity.zIndex * 5}
        title="Actions"
        description="Select an action"
      >
        <ActionSheetItem onClick={handleAction("add")} label="Add" />
        <ActionSheetItem onClick={handleAction("edit")} label="Edit" />
        <ActionSheetItem onClick={handleAction("delete")} tone="critical" label="Delete" />
      </ActionSheetContent>
    </ActionSheetRoot>
  );
};

export default ActivityActionSheet;
