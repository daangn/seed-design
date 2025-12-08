import { HStack, Portal, VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import {
  useActivityParams,
  useFlow,
  useStepFlow,
  type StaticActivityComponentType,
} from "@stackflow/react/future";
import { useEffect, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { AppBar, AppBarMain, AppBarIconButton, AppBarRight } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

declare module "@stackflow/config" {
  interface Register {
    ActivityAlertDialogStep: {
      "alert-dialog"?: "open";
    };
  }
}

const ActivityAlertDialogStep: StaticActivityComponentType<"ActivityAlertDialogStep"> = () => {
  const [open, setOpen] = useState(false);
  const { push } = useFlow();
  const { pushStep, popStep } = useStepFlow("ActivityAlertDialogStep");
  const params = useActivityParams<"ActivityAlertDialogStep">();
  const isOverlayOpen = params["alert-dialog"] === "open";

  useEffect(() => setOpen(isOverlayOpen), [isOverlayOpen]);

  const onOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);

    if (newOpen && !isOverlayOpen) {
      pushStep((params) => ({ ...params, "alert-dialog": "open" }));
      return;
    }

    if (!newOpen && isOverlayOpen) {
      popStep();
      return;
    }
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
        <AlertDialogRoot open={open} onOpenChange={onOpenChange}>
          <AlertDialogTrigger asChild>
            <VStack p="x5" justify="center" gap="x4">
              <ActionButton variant="neutralSolid" flexGrow>
                Alert Dialog 열기
              </ActionButton>
            </VStack>
          </AlertDialogTrigger>
          <Portal>
            <AlertDialogContent layerIndex={useActivityZIndexBase({ activityOffset: 1 })}>
              <AlertDialogHeader>
                <AlertDialogTitle>Step</AlertDialogTitle>
                <AlertDialogDescription>
                  Alert Dialog가 Step으로 만들어져 있기 때문에 뒤로 가기로 닫을 수 있습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <HStack gap="x2">
                  <ActionButton onClick={() => setOpen(false)} variant="neutralWeak">
                    닫기
                  </ActionButton>
                  <ActionButton
                    flexGrow
                    variant="neutralSolid"
                    onClick={() => {
                      // 이 Alert Dialog는 Activity로 만들어지지 않았기 때문에, z-index 정리를 위해
                      // Alert Dialog를 먼저 닫고 다음 Activity를 push해야 합니다.
                      setOpen(false);
                      push("ActivityDetail", {
                        title: "Alert Dialog에서 이동한 화면",
                        body: "Alert Dialog를 닫고 이동했습니다.",
                      });
                    }}
                  >
                    Push
                  </ActionButton>
                </HStack>
              </AlertDialogFooter>
            </AlertDialogContent>
          </Portal>
        </AlertDialogRoot>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAlertDialogStep;
