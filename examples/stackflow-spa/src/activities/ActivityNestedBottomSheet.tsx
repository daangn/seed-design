import { VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import { Callout } from "seed-design/ui/callout";

declare module "@stackflow/config" {
  interface Register {
    ActivityNestedBottomSheet: {};
  }
}

const ActivityNestedBottomSheet: StaticActivityComponentType<"ActivityNestedBottomSheet"> = () => {
  const { pop, push } = useFlow();
  const { isActive, transitionState } = useActivity();

  const open = transitionState === "enter-active" || transitionState === "enter-done";
  const onOpenChange = (next: boolean) => !next && isActive && pop();

  return (
    // 위에 AlertDialog Activity가 push되어 BottomSheet가 비활성(isActive=false)이 되더라도
    // BottomSheet 자체의 modal 동작과 backdrop을 유지해 dim layering이 끊기지 않도록 modal을 항상 true로 둔다.
    // outside close는 onOpenChange에서 isActive 가드로 막혀 비활성 상태에서는 pop이 발생하지 않는다.
    <BottomSheetRoot open={open} onOpenChange={onOpenChange} modal>
      <BottomSheetContent
        showHandle
        title="BottomSheet × AlertDialog (Activity)"
        description="아래 버튼으로 AlertDialog Activity를 push해 위에 얹어보세요."
        layerIndex={useActivityZIndexBase()}
      >
        <BottomSheetBody>
          <Callout
            tone="neutral"
            description="Activity 패턴: BottomSheet가 자체 Activity로 떠 있고, 그 위에 AlertDialog Activity가 push되어 얹힙니다. 위에 떠 있는 AlertDialog의 Backdrop이나 Content 빈 영역을 클릭해 동작을 관찰해보세요."
          />
        </BottomSheetBody>
        <BottomSheetFooter>
          <VStack gap="x2">
            <ActionButton
              variant="neutralSolid"
              flexGrow
              onClick={() => push("ActivityAlertDialog", {})}
            >
              Open AlertDialog
            </ActionButton>
            <ActionButton variant="neutralWeak" onClick={pop}>
              닫기
            </ActionButton>
          </VStack>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityNestedBottomSheet;
