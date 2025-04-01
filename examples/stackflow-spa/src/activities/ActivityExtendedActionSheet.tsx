import { useActivity, type ActivityComponentType } from "@stackflow/react";

import { IconPencilLine, IconPlusLine, IconTrashcanLine } from "@daangn/react-monochrome-icon";
import {
  ExtendedActionSheetContent,
  ExtendedActionSheetGroup,
  ExtendedActionSheetItem,
  ExtendedActionSheetRoot,
} from "../seed-design/ui/extended-action-sheet";
import { createCallbackActivity } from "../stackflow/createCallbackActivity";
import { PrefixIcon } from "@seed-design/react";

type Action = "add" | "edit" | "delete" | "test1" | "test2";

export const extendedActionSheetCallback = createCallbackActivity(
  "ActivityExtendedActionSheet",
  {} as {
    action: Action;
  },
);

const ActivityExtendedActionSheet: ActivityComponentType = () => {
  const { pop } = extendedActionSheetCallback.useCallbackPop();
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
    <ExtendedActionSheetRoot open={activity.isActive} onOpenChange={handleClose}>
      <ExtendedActionSheetContent title="Actions" layerIndex={activity.zIndex * 5}>
        <ExtendedActionSheetGroup>
          <ExtendedActionSheetItem onClick={handleAction("add")}>
            <PrefixIcon svg={<IconPlusLine />} />
            Add
          </ExtendedActionSheetItem>
          <ExtendedActionSheetItem onClick={handleAction("edit")}>
            <PrefixIcon svg={<IconPencilLine />} />
            Edit
          </ExtendedActionSheetItem>
        </ExtendedActionSheetGroup>
        <ExtendedActionSheetGroup>
          <ExtendedActionSheetItem onClick={handleAction("test1")}>
            <PrefixIcon svg={<IconPlusLine />} />
            Test1
          </ExtendedActionSheetItem>
          <ExtendedActionSheetItem onClick={handleAction("test2")}>
            <PrefixIcon svg={<IconPlusLine />} />
            Test2
          </ExtendedActionSheetItem>
          <ExtendedActionSheetItem onClick={handleAction("delete")} tone="critical">
            <PrefixIcon svg={<IconTrashcanLine />} />
            Delete
          </ExtendedActionSheetItem>
        </ExtendedActionSheetGroup>
      </ExtendedActionSheetContent>
    </ExtendedActionSheetRoot>
  );
};

export default ActivityExtendedActionSheet;
