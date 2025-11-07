import { useActivity, type ActivityComponentType } from "@stackflow/react/future";

import {
  IconPencilLine,
  IconPlusLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
} from "seed-design/ui/menu-sheet";
import { createCallbackActivity } from "../stackflow/createCallbackActivity";
import { PrefixIcon } from "@seed-design/react";

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

const ActivityMenuSheet: ActivityComponentType<"ActivityMenuSheet"> = () => {
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
      {/* TODO: there should be an API to get z-indices of AppScreen elements */}
      {/* since overlay components are often portalled, CSS variables might not be enough */}
      {/* z-index of AppBar is base + 4 (see the recipe) */}
      <MenuSheetContent title="Actions" layerIndex={activity.zIndex + 4}>
        <MenuSheetGroup>
          <MenuSheetItem onClick={handleAction("add")}>
            <PrefixIcon svg={<IconPlusLine />} />
            Add
          </MenuSheetItem>
          <MenuSheetItem onClick={handleAction("edit")}>
            <PrefixIcon svg={<IconPencilLine />} />
            Edit
          </MenuSheetItem>
        </MenuSheetGroup>
        <MenuSheetGroup labelAlign="center">
          <MenuSheetItem onClick={handleAction("test1")}>Test1</MenuSheetItem>
          <MenuSheetItem onClick={handleAction("test2")}>Test2</MenuSheetItem>
          <MenuSheetItem onClick={handleAction("delete")} tone="critical" labelAlign="left">
            <PrefixIcon svg={<IconTrashcanLine />} />
            Delete
          </MenuSheetItem>
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default ActivityMenuSheet;
