import { useActivity, type StaticActivityComponentType } from "@stackflow/react/future";

import { IconPencilLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
} from "seed-design/ui/swipeable-menu-sheet";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";
import { createCallbackActivity } from "../stackflow/createCallbackActivity";
import { useActivityZIndexBase } from "@seed-design/stackflow";

type Action = "add" | "edit" | "delete" | "test1" | "test2";

export const swipeableMenuSheetCallback = createCallbackActivity(
  "ActivitySwipeableMenuSheet",
  {} as {
    action: Action;
  },
);

declare module "@stackflow/config" {
  interface Register {
    ActivitySwipeableMenuSheet: {};
  }
}

const ActivitySwipeableMenuSheet: StaticActivityComponentType<
  "ActivitySwipeableMenuSheet"
> = () => {
  const { pop } = swipeableMenuSheetCallback.useCallbackPop();
  const activity = useActivity();
  const snackbar = useSnackbarAdapter();

  const handleAction = (action: Action) => () => {
    snackbar.create({
      render: () => <Snackbar variant="positive" message={`선택한 액션: ${action}`} />,
    });
    pop({ action });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      pop();
    }
  };

  return (
    <SwipeableMenuSheetRoot open={activity.isActive} onOpenChange={handleClose}>
      <SwipeableMenuSheetContent title="Actions" layerIndex={useActivityZIndexBase()}>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem
            onClick={handleAction("add")}
            label="Add"
            prefixIcon={<IconPlusLine />}
          />
          <SwipeableMenuSheetItem
            onClick={handleAction("edit")}
            label="Edit Proident pariatur do cillum labore nisi ex velit fugiat laboris pariatur consequat mollit ex culpa cillum."
            description="Aliqua reprehenderit nostrud ea laborum. Aliquip qui sint amet nulla aliqua mollit consequat sint nostrud cupidatat nisi."
            prefixIcon={<IconPencilLine />}
          />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup labelAlign="center">
          <SwipeableMenuSheetItem onClick={handleAction("test1")} label="Test1" />
          <SwipeableMenuSheetItem onClick={handleAction("test2")} label="Test2" />
          <SwipeableMenuSheetItem
            onClick={handleAction("delete")}
            tone="critical"
            label="Adipisicing commodo et ex ad reprehenderit. Excepteur sint aute voluptate id."
          />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
};

export default ActivitySwipeableMenuSheet;
