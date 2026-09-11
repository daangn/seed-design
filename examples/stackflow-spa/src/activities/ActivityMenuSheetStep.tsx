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
import {
  NextAppBar,
  NextAppBarIconButton,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";
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
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarMain title="Step" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
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
                  label="Push"
                />
              </MenuSheetGroup>
            </MenuSheetContent>
          </Portal>
        </MenuSheetRoot>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityMenuSheetStep;
