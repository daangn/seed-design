import { HStack, Portal, VStack, Text, Flex } from "@seed-design/react";
import { useZIndexBase } from "@seed-design/stackflow";
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
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";
import { Callout } from "seed-design/ui/callout";
import { useTheme } from "../contexts/ThemeContext";

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
  }, [isOverlayOpen]);

  const onOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);

    if (newOpen && !isOverlayOpen) {
      pushStep({ ...params, "bottom-sheet": "open" });
      return;
    }

    if (!newOpen && isOverlayOpen) {
      popStep();
      return;
    }
  };

  return (
    <AppScreen theme={useTheme().theme}>
      <AppBar>
        <AppBarMain title="Bottom Sheet - Step Pattern" />
      </AppBar>
      <AppScreenContent>
        <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
          <BottomSheetTrigger asChild>
            <Flex p="x5" justify="center">
              <ActionButton variant="neutralSolid">Bottom Sheet 열기</ActionButton>
            </Flex>
          </BottomSheetTrigger>
          <Portal>
            <BottomSheetContent
              showHandle
              title="Step으로 관리되는 Bottom Sheet"
              description="뒤로 가기로 닫을 수 있습니다"
              layerIndex={useZIndexBase({ modifier: +1 })}
            >
              <BottomSheetFooter>
                <HStack gap="x2">
                  <ActionButton onClick={() => setOpen(false)} variant="neutralWeak">
                    취소
                  </ActionButton>
                  <ActionButton
                    flexGrow
                    variant="neutralSolid"
                    onClick={() => {
                      // Bottom Sheet를 먼저 닫고 다른 Activity로 이동
                      setOpen(false);
                      push("ActivityDetail", {
                        title: "Bottom Sheet에서 이동한 화면",
                        body: "Bottom Sheet를 닫고 이동했습니다.",
                      });
                    }}
                  >
                    다음 화면으로
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
