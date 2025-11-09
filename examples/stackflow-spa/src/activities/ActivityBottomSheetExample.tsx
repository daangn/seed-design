import { Portal, VStack } from "@seed-design/react";
import { useActivity, useFlow, type ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { List, ListButtonItem } from "seed-design/ui/list";
import { ListHeader } from "seed-design/ui/list-header";
// import { useStepOverlay } from "seed-design/util/use-step-overlay";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";
import { useTheme } from "../contexts/ThemeContext";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetExample: {};
  }
}

const ActivityBottomSheetExample: ActivityComponentType<"ActivityBottomSheetExample"> = () => {
  const { push } = useFlow();
  // const { dialogProps, setOpen } = useStepOverlay();
  const { zIndex } = useActivity();

  return (
    <AppScreen theme={useTheme().theme}>
      <AppBar>
        <AppBarMain title="BottomSheet as an activity or a step" />
      </AppBar>
      <AppScreenContent>
        <VStack>
          <ListHeader>Activity</ListHeader>
          <List>
            <ListButtonItem
              title="Activity"
              onClick={() => push("ActivityBottomSheetSimple", {})}
            />
            <ListButtonItem
              title="Activity, Form"
              detail="폼을 제출하면 닫히는 BottomSheet 예제"
              onClick={() => push("ActivityBottomSheetForm", {})}
            />
            <ListButtonItem
              title="Activity, Nested"
              detail="BottomSheet 내부에서 다른 Activity를 푸시하는 예제"
              onClick={() => push("ActivityBottomSheetNested", {})}
            />
          </List>
          <ListHeader>Stackflow 의존성이 없는 경우</ListHeader>
          <List>
            <BottomSheetRoot>
              <BottomSheetTrigger asChild>
                <ListButtonItem title="Stackflow에 의존하지 않는 BottomSheet" />
              </BottomSheetTrigger>
              <Portal>
                <BottomSheetContent
                  showHandle
                  showCloseButton={false}
                  title="Stackflow에 의존하지 않는 BottomSheet"
                  layerIndex={zIndex + 4}
                />
              </Portal>
            </BottomSheetRoot>
          </List>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityBottomSheetExample;
