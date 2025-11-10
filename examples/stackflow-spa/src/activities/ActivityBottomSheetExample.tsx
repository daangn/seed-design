import { BottomSheetFooter, Portal, VStack } from "@seed-design/react";
import { useActivity, useFlow, type ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { List, ListButtonItem } from "seed-design/ui/list";
import { ListHeader } from "seed-design/ui/list-header";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";
import { useTheme } from "../contexts/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { ActionButton } from "seed-design/ui/action-button";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetExample: {};
  }
}

const ActivityBottomSheetExample: ActivityComponentType<"ActivityBottomSheetExample"> = () => {
  const { push } = useFlow();

  const [isPortalledBottomSheetOpen, setIsPortalledBottomSheetOpen] = useState(false);

  return (
    <AppScreen
      theme={useTheme().theme}
      // ref={() => setStack(document.querySelector("[data-stackflow-stack]"))}
    >
      <AppBar>
        <AppBarMain title="BottomSheet as an Activity" />
      </AppBar>
      <AppScreenContent>
        <VStack>
          <ListHeader>Activity</ListHeader>
          <List>
            <ListButtonItem
              title="Bottom Sheet Activity"
              onClick={() => push("ActivityBottomSheetSimple", {})}
            />
            <ListButtonItem
              title="Bottom Sheet Activity, Form"
              detail="폼을 제출하면 닫히는 BottomSheet 예제"
              onClick={() => push("ActivityBottomSheetForm", {})}
            />
            <ListButtonItem
              title="Bottom Sheet Activity, Nested"
              detail="BottomSheet 내부에서 다른 Activity를 푸시하는 예제"
              onClick={() => push("ActivityBottomSheetNested", {})}
            />
          </List>
          <ListHeader>Portalled</ListHeader>
          <List>
            <BottomSheetRoot
              open={isPortalledBottomSheetOpen}
              onOpenChange={setIsPortalledBottomSheetOpen}
            >
              <BottomSheetTrigger asChild>
                <ListButtonItem
                  title="단순 Portal"
                  detail="document.body에 렌더링되는 BottomSheet"
                />
              </BottomSheetTrigger>
              <Portal>
                <BottomSheetContent
                  showHandle
                  showCloseButton={false}
                  title="단순 Body Portal"
                  description="적절한 z-index 추가가 필요함"
                >
                  <BottomSheetFooter>
                    <ActionButton
                      onClick={() => setIsPortalledBottomSheetOpen(false)}
                      variant="neutralSolid"
                      size="large"
                    >
                      확인
                    </ActionButton>
                  </BottomSheetFooter>
                </BottomSheetContent>
              </Portal>
            </BottomSheetRoot>
            <ListButtonItem
              title="Push to here"
              onClick={() => push("ActivityBottomSheetExample", {})}
            />
            {/* <BottomSheetRoot>
              <BottomSheetTrigger asChild>
                <ListButtonItem title="Stack 안으로 Portal" />
              </BottomSheetTrigger>
              <Portal container={stack}>
                <BottomSheetContent
                  showHandle
                  showCloseButton={false}
                  title="Stack 안으로 Portal"
                  description="z-index 핸들이 필요 없음"
                >
                  <BottomSheetBody>
                    <ActionButton onClick={() => push("ActivityBottomSheetSimple", {})}>
                      Push another Activity
                    </ActionButton>
                  </BottomSheetBody>
                  <BottomSheetFooter>
                    <ActionButton variant="neutralSolid" size="large">
                      확인
                    </ActionButton>
                  </BottomSheetFooter>
                </BottomSheetContent>
              </Portal>
            </BottomSheetRoot> */}
          </List>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityBottomSheetExample;
