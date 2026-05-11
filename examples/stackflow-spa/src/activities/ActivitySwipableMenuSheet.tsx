import { useActivity, type StaticActivityComponentType } from "@stackflow/react/future";

import { IconPencilLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import {
  SwipableMenuSheetContent,
  SwipableMenuSheetGroup,
  SwipableMenuSheetItem,
  SwipableMenuSheetRoot,
} from "seed-design/ui/swipable-menu-sheet";
import { createCallbackActivity } from "../stackflow/createCallbackActivity";
import { useActivityZIndexBase } from "@seed-design/stackflow";

type Action = "add" | "edit" | "delete" | "test1" | "test2";

export const swipableMenuSheetCallback = createCallbackActivity(
  "ActivitySwipableMenuSheet",
  {} as {
    action: Action;
  },
);

declare module "@stackflow/config" {
  interface Register {
    ActivitySwipableMenuSheet: {};
  }
}

const ActivitySwipableMenuSheet: StaticActivityComponentType<"ActivitySwipableMenuSheet"> = () => {
  const { pop } = swipableMenuSheetCallback.useCallbackPop();
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
    <SwipableMenuSheetRoot open={activity.isActive} onOpenChange={handleClose}>
      <SwipableMenuSheetContent title="Actions" layerIndex={useActivityZIndexBase()}>
        <SwipableMenuSheetGroup>
          <SwipableMenuSheetItem
            onClick={handleAction("add")}
            label="Add"
            prefixIcon={<IconPlusLine />}
          />
          <SwipableMenuSheetItem
            onClick={handleAction("edit")}
            label="Edit Proident pariatur do cillum labore nisi ex velit fugiat laboris pariatur consequat mollit ex culpa cillum."
            description="Aliqua reprehenderit nostrud ea laborum. Aliquip qui sint amet nulla aliqua mollit consequat sint nostrud cupidatat nisi."
            prefixIcon={<IconPencilLine />}
          />
        </SwipableMenuSheetGroup>
        <SwipableMenuSheetGroup labelAlign="center">
          <SwipableMenuSheetItem onClick={handleAction("test1")} label="Test1" />
          <SwipableMenuSheetItem onClick={handleAction("test2")} label="Test2" />
          <SwipableMenuSheetItem
            onClick={handleAction("delete")}
            tone="critical"
            label="Adipisicing commodo et ex ad reprehenderit. Excepteur sint aute voluptate id."
          />
        </SwipableMenuSheetGroup>
      </SwipableMenuSheetContent>
    </SwipableMenuSheetRoot>
  );
};

export default ActivitySwipableMenuSheet;
