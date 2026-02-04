import { VStack, Text } from "@seed-design/react";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { BottomSheetBody, BottomSheetContent, BottomSheetRoot } from "seed-design/ui/bottom-sheet";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { Switch } from "seed-design/ui/switch";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetModalTest: {};
  }
}

const ActivityBottomSheetModalTest: StaticActivityComponentType<
  "ActivityBottomSheetModalTest"
> = () => {
  const { pop } = useFlow();
  const activity = useActivity();

  const [modal, setModal] = useState(true);

  const open = activity.isActive;
  const onOpenChange = (open: boolean) => !open && pop();

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange} modal={modal} headerAlign="center">
      <BottomSheetContent
        showHandle
        showCloseButton={false}
        title="BottomSheet Modal Prop 테스트"
        layerIndex={useActivityZIndexBase()}
        description="이 화면은 BottomSheet의 modal prop을 동적으로 변경할 때 애니메이션이 재실행되지 않는지 테스트하기 위한 화면입니다."
      >
        <BottomSheetBody>
          <VStack gap="spacingY.componentDefault">
            <Text textStyle="t4Regular" color="fg.neutral">
              이 화면은 BottomSheet의 modal prop을 동적으로 변경할 때 애니메이션이 재실행되지 않는지
              테스트하기 위한 화면입니다.
            </Text>

            <VStack gap="x2">
              <Text textStyle="t4Regular" color="fg.neutral">
                현재 modal: <strong>{modal ? "true" : "false"}</strong>
              </Text>

              <Switch
                tone="neutral"
                size="16"
                label="modal prop 토글"
                checked={modal}
                onCheckedChange={setModal}
              />
            </VStack>

            <ActionButton variant="neutralSolid" onClick={pop}>
              닫기
            </ActionButton>
          </VStack>
        </BottomSheetBody>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityBottomSheetModalTest;
