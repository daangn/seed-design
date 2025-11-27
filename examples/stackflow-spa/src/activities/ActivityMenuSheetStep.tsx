import { Portal, VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import {
  useActivityParams,
  useFlow,
  useStepFlow,
  type StaticActivityComponentType,
} from "@stackflow/react/future";
import { useEffect, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { AppBar, AppBarIconButton, AppBarMain, AppBarRight } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";
import { PrefixIcon } from "@seed-design/react";
import {
  IconHouseLine,
  IconPencilLine,
  IconPlusLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";

declare module "@stackflow/config" {
  interface Register {
    ActivityMenuSheetStep: {
      "menu-sheet"?: "open";
    };
  }
}

const ActivityMenuSheetStep: StaticActivityComponentType<"ActivityMenuSheetStep"> = () => {
  const [open, setOpen] = useState(false);
  const { push } = useFlow();
  const { pushStep, popStep } = useStepFlow("ActivityMenuSheetStep");
  const params = useActivityParams<"ActivityMenuSheetStep">();
  const isOverlayOpen = params["menu-sheet"] === "open";
  const snackbar = useSnackbarAdapter();

  useEffect(() => setOpen(isOverlayOpen), [isOverlayOpen]);

  const onOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);

    if (newOpen && !isOverlayOpen) {
      pushStep((params) => ({ ...params, "menu-sheet": "open" }));
      return;
    }

    if (!newOpen && isOverlayOpen) {
      popStep();
      return;
    }
  };

  const handleAction = (action: string) => {
    snackbar.create({
      render: () => <Snackbar variant="positive" message={`선택한 액션: ${action}`} />,
    });
    setOpen(false);
  };

  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="Step" />
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <MenuSheetRoot open={open} onOpenChange={onOpenChange}>
          <MenuSheetTrigger asChild>
            <VStack p="x5" justify="center" gap="x4">
              <ActionButton variant="neutralSolid" flexGrow>
                Menu Sheet 열기
              </ActionButton>
            </VStack>
          </MenuSheetTrigger>
          <Portal>
            <MenuSheetContent
              title="Step"
              layerIndex={useActivityZIndexBase({ activityOffset: 1 })}
            >
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
                  onClick={() => {
                    // 이 Menu Sheet는 Activity로 만들어지지 않았기 때문에, z-index 정리를 위해
                    // Menu Sheet를 먼저 닫고 다음 Activity를 push해야 합니다.
                    setOpen(false);
                    push("ActivityDetail", {
                      title: "Menu Sheet에서 이동한 화면",
                      body: "Menu Sheet를 닫고 이동했습니다.",
                    });
                  }}
                >
                  Push
                </MenuSheetItem>
              </MenuSheetGroup>
            </MenuSheetContent>
          </Portal>
        </MenuSheetRoot>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityMenuSheetStep;
