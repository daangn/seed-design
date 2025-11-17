import { HStack, Portal, VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import {
  useActivityParams,
  useFlow,
  useStepFlow,
  type ActivityComponentType,
} from "@stackflow/react/future";
import { useEffect, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { AppBar, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import {
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetStep: {
      "bottom-sheet"?: "open";
    };
  }
}

const ActivityBottomSheetStep: ActivityComponentType<"ActivityBottomSheetStep"> = () => {
  const [open, setOpen] = useState(false);
  const { push } = useFlow();
  const { pushStep, popStep } = useStepFlow("ActivityBottomSheetStep");
  const params = useActivityParams<"ActivityBottomSheetStep">();
  const isOverlayOpen = params["bottom-sheet"] === "open";

  useEffect(() => {
    if (!isOverlayOpen) {
      setOpen(false);
    }

    if (isOverlayOpen) {
      setOpen(true);
    }
  }, [isOverlayOpen]);

  const onOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);

    if (newOpen && !isOverlayOpen) {
      pushStep((params) => ({ ...params, "bottom-sheet": "open" }));
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
      </AppBar>
      <AppScreenContent>
        <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
          <BottomSheetTrigger asChild>
            <VStack p="x5" justify="center" gap="x4">
              <ActionButton variant="neutralSolid" flexGrow>
                Bottom Sheet 열기
              </ActionButton>
            </VStack>
          </BottomSheetTrigger>
          <Portal>
            <BottomSheetContent
              showHandle
              title="Step"
              description="Bottom Sheet가 Step으로 만들어져 있기 때문에 뒤로 가기로 닫을 수 있습니다."
              layerIndex={useActivityZIndexBase({ activityOffset: 1 })}
            >
              <BottomSheetFooter>
                <HStack gap="x2">
                  <ActionButton onClick={() => popStep()} variant="neutralWeak">
                    닫기
                  </ActionButton>
                  <ActionButton
                    flexGrow
                    variant="neutralSolid"
                    onClick={() => {
                      // 이 Bottom Sheet는 Activity로 만들어지지 않았기 때문에, z-index 정리를 위해
                      // BottomSheet를 먼저 닫고 다음 Activity를 push해야 합니다.
                      popStep();
                      push("ActivityDetail", {
                        title: "Bottom Sheet에서 이동한 화면",
                        body: "Bottom Sheet를 닫고 이동했습니다.",
                      });
                    }}
                  >
                    Push
                  </ActionButton>
                </HStack>
              </BottomSheetFooter>
            </BottomSheetContent>
          </Portal>
        </BottomSheetRoot>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityBottomSheetStep;
