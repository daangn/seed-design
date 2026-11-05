import { Box, Portal, VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { type StaticActivityComponentType } from "@stackflow/react/future";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";
import { Callout } from "seed-design/ui/callout";
import { useStepOverlay } from "seed-design/stackflow/use-step-overlay";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetWithAlertDialogStep: {
      "bottom-sheet"?: "open";
      "alert-dialog"?: "open";
    };
  }
}

const ActivityBottomSheetWithAlertDialogStep: StaticActivityComponentType<
  "ActivityBottomSheetWithAlertDialogStep"
> = () => {
  const bottomSheet = useStepOverlay({ key: "bottom-sheet" });
  const alertDialog = useStepOverlay({ key: "alert-dialog" });

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="BottomSheet × AlertDialog (Step)" />
      </AppBar>
      <AppScreenContent>
        <VStack p="x5" gap="x4">
          <Box px="spacingX.globalGutter">
            <Callout
              tone="neutral"
              title="Step 패턴"
              description="useStepOverlay로 BottomSheet step과 AlertDialog step을 한 Activity 안에서 동시에 사용합니다. BottomSheet 위에 AlertDialog를 얹은 상태에서 AlertDialog의 Backdrop이나 Content 빈 영역을 클릭해 동작을 관찰해보세요."
            />
          </Box>
          <BottomSheetRoot
            {...bottomSheet.overlayProps}
            // AlertDialog가 떠있는 동안 BottomSheet의 outside-press는 무시한다.
            // AlertDialog는 closeOnInteractOutside=true이므로 자체적으로 닫히고,
            // BottomSheet는 외부 클릭으로 닫히지 않도록 비활성화한다.
            closeOnInteractOutside={!alertDialog.open}
          >
            <BottomSheetTrigger asChild>
              <ActionButton variant="neutralSolid" flexGrow>
                Open BottomSheet
              </ActionButton>
            </BottomSheetTrigger>
            <Portal>
              <BottomSheetContent
                showHandle
                title="BottomSheet (step)"
                description="이 BottomSheet 위에 AlertDialog를 얹어볼 수 있어요."
                layerIndex={useActivityZIndexBase({ activityOffset: 1 })}
              >
                <BottomSheetBody>
                  <AlertDialogRoot {...alertDialog.overlayProps} closeOnInteractOutside>
                    <AlertDialogTrigger asChild>
                      <ActionButton variant="neutralSolid" flexGrow>
                        Open AlertDialog
                      </ActionButton>
                    </AlertDialogTrigger>
                    <Portal>
                      <AlertDialogContent layerIndex={useActivityZIndexBase({ activityOffset: 2 })}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>제목</AlertDialogTitle>
                          <AlertDialogDescription>
                            AlertDialog Backdrop 또는 Content 빈 영역을 클릭해 동작을 관찰해보세요.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <ActionButton
                            variant="neutralSolid"
                            onClick={() => alertDialog.setOpen(false)}
                          >
                            닫기
                          </ActionButton>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </Portal>
                  </AlertDialogRoot>
                </BottomSheetBody>
                <BottomSheetFooter>
                  <ActionButton variant="neutralWeak" onClick={() => bottomSheet.setOpen(false)}>
                    닫기
                  </ActionButton>
                </BottomSheetFooter>
              </BottomSheetContent>
            </Portal>
          </BottomSheetRoot>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityBottomSheetWithAlertDialogStep;
