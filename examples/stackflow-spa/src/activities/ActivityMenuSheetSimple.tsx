import { Flex, VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";
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
import { Switch } from "seed-design/ui/switch";

declare module "@stackflow/config" {
  interface Register {
    ActivityMenuSheetSimple: {};
  }
}

const ActivityMenuSheetSimple: StaticActivityComponentType<"ActivityMenuSheetSimple"> = () => {
  const { pop, push } = useFlow();
  const activity = useActivity();
  const snackbar = useSnackbarAdapter();

  const [keepMounted, setKeepMounted] = useState(false);

  const handleAction = (action: string) => {
    snackbar.create({
      render: () => <Snackbar variant="positive" message={`선택한 액션: ${action}`} />,
    });
    pop();
  };

  const open = keepMounted
    ? activity.transitionState === "enter-active" || activity.transitionState === "enter-done"
    : activity.isActive;

  const onOpenChange = keepMounted
    ? (open: boolean) => !open && activity.isActive && pop()
    : (open: boolean) => !open && pop();

  return (
    <MenuSheetRoot
      open={open}
      modal={keepMounted ? activity.isActive : undefined}
      onOpenChange={onOpenChange}
    >
      <MenuSheetContent title="Actions" layerIndex={useActivityZIndexBase()}>
        <MenuSheetGroup>
          <MenuSheetItem
            onClick={() => handleAction("add")}
            label="추가"
            prefixIcon={<IconPlusLine />}
          />
          <MenuSheetItem
            onClick={() => handleAction("edit")}
            label="수정"
            prefixIcon={<IconPencilLine />}
          />
          <MenuSheetItem
            onClick={() => handleAction("delete")}
            tone="critical"
            label="삭제"
            prefixIcon={<IconTrashcanLine />}
          />
        </MenuSheetGroup>
        <VStack gap="x2">
          <MenuSheetGroup>
            <MenuSheetItem
              onClick={() =>
                push("ActivityDetail", {
                  title: "Activity",
                  body: keepMounted
                    ? "MenuSheet가 언마운트되지 않았으므로, 현재 Activity를 pop하는 경우 MenuSheet가 열린 상태로 표시됩니다."
                    : "MenuSheet가 언마운트되었으므로, 현재 Activity를 pop하는 경우 MenuSheet가 다시 enter 트랜지션을 재생하며 마운트됩니다.",
                })
              }
              label="Push"
            />
          </MenuSheetGroup>
          <Flex px="x2" py="x1_5">
            <Switch
              tone="neutral"
              size="16"
              label="Push 이후에도 MenuSheet 마운트 유지"
              checked={keepMounted}
              onCheckedChange={setKeepMounted}
            />
          </Flex>
        </VStack>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default ActivityMenuSheetSimple;
