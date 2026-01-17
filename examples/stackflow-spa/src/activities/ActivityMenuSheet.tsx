import { useActivity, type StaticActivityComponentType } from "@stackflow/react/future";

import { IconPencilLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
} from "seed-design/ui/menu-sheet";
import { createCallbackActivity } from "../stackflow/createCallbackActivity";
import { useActivityZIndexBase } from "@seed-design/stackflow";

type Action = "add" | "edit" | "delete" | "test1" | "test2";

export const menuSheetCallback = createCallbackActivity(
  "ActivityMenuSheet",
  {} as {
    action: Action;
  },
);

declare module "@stackflow/config" {
  interface Register {
    ActivityMenuSheet: {};
  }
}

const ActivityMenuSheet: StaticActivityComponentType<"ActivityMenuSheet"> = () => {
  const { pop } = menuSheetCallback.useCallbackPop();
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
    <MenuSheetRoot open={activity.isActive} onOpenChange={handleClose}>
      <MenuSheetContent title="Actions" layerIndex={useActivityZIndexBase()}>
        <MenuSheetGroup>
          <MenuSheetItem onClick={handleAction("add")} label="Add" prefixIcon={<IconPlusLine />} />
          <MenuSheetItem
            onClick={handleAction("edit")}
            label="Edit Proident pariatur do cillum labore nisi ex velit fugiat laboris pariatur consequat mollit ex culpa cillum."
            description="Aliqua reprehenderit nostrud ea laborum. Aliquip qui sint amet nulla aliqua mollit consequat sint nostrud cupidatat nisi."
            prefixIcon={<IconPencilLine />}
          />
        </MenuSheetGroup>
        <MenuSheetGroup labelAlign="center">
          <MenuSheetItem onClick={handleAction("test1")} label="Test1" />
          <MenuSheetItem onClick={handleAction("test2")} label="Test2" />
          <MenuSheetItem
            onClick={handleAction("delete")}
            tone="critical"
            label="Adipisicing commodo et ex ad reprehenderit. Excepteur sint aute voluptate id."
          />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default ActivityMenuSheet;
