import { useActivityZIndexBase } from "@seed-design/stackflow";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react";
import {
  IconPencilLine,
  IconPlusLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
} from "seed-design/ui/swipeable-menu-sheet";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";

declare module "@stackflow/config" {
  interface Register {
    ActivityMenuSheetSimple: {};
  }
}

const ActivityMenuSheetSimple: StaticActivityComponentType<"ActivityMenuSheetSimple"> = () => {
  const { pop } = useFlow();
  const activity = useActivity();
  const snackbar = useSnackbarAdapter();

  const handleAction = (action: string) => {
    snackbar.create({
      render: () => <Snackbar variant="positive" message={`선택한 액션: ${action}`} />,
    });
    pop();
  };

  return (
    <SwipeableMenuSheetRoot open={activity.isActive} onOpenChange={(open) => !open && pop()}>
      <SwipeableMenuSheetContent title="Actions" layerIndex={useActivityZIndexBase()}>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem
            onClick={() => handleAction("add")}
            label="추가"
            prefixIcon={<IconPlusLine />}
          />
          <SwipeableMenuSheetItem
            onClick={() => handleAction("edit")}
            label="수정"
            prefixIcon={<IconPencilLine />}
          />
          <SwipeableMenuSheetItem
            onClick={() => handleAction("delete")}
            tone="critical"
            label="삭제"
            prefixIcon={<IconTrashcanLine />}
          />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
};

export default ActivityMenuSheetSimple;
