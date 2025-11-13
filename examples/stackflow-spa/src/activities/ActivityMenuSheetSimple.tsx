import { PrefixIcon } from "@seed-design/react";
import { useZIndexBase } from "@seed-design/stackflow";
import { useActivity, useFlow, type ActivityComponentType } from "@stackflow/react/future";
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
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";

declare module "@stackflow/config" {
  interface Register {
    ActivityMenuSheetSimple: {};
  }
}

const ActivityMenuSheetSimple: ActivityComponentType<"ActivityMenuSheetSimple"> = () => {
  const { pop, push } = useFlow();
  const { isActive } = useActivity();
  const snackbar = useSnackbarAdapter();

  const handleAction = (action: string) => {
    snackbar.create({
      render: () => <Snackbar variant="positive" message={`선택한 액션: ${action}`} />,
    });
    pop();
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      pop();
    }
  };

  return (
    <MenuSheetRoot open={isActive} onOpenChange={handleClose}>
      <MenuSheetContent title="Actions" layerIndex={useZIndexBase()}>
        <MenuSheetGroup>
          <MenuSheetItem onClick={() => handleAction("add")}>
            <PrefixIcon svg={<IconPlusLine />} />
            추가
          </MenuSheetItem>
          <MenuSheetItem onClick={() => handleAction("edit")}>
            <PrefixIcon svg={<IconPencilLine />} />
            수정
          </MenuSheetItem>
          <MenuSheetItem onClick={() => handleAction("delete")} tone="critical">
            <PrefixIcon svg={<IconTrashcanLine />} />
            삭제
          </MenuSheetItem>
        </MenuSheetGroup>
        <MenuSheetGroup labelAlign="center">
          <MenuSheetItem
            onClick={() =>
              push("ActivityDetail", {
                title: "Menu Sheet에서 이동",
                body: "Menu Sheet Activity 내부에서 다른 Activity를 push할 수 있습니다.",
              })
            }
          >
            Push
          </MenuSheetItem>
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default ActivityMenuSheetSimple;
