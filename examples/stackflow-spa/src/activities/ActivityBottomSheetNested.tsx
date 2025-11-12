import { IconGearLine, IconILowercaseSerifCircleLine } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon, VStack } from "@seed-design/react";
import { useZIndexBase } from "@seed-design/stackflow";
import { useActivity, useFlow, type ActivityComponentType } from "@stackflow/react/future";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetNested: {};
  }
}

const ActivityBottomSheetNested: ActivityComponentType<"ActivityBottomSheetNested"> = () => {
  const { pop, push } = useFlow();
  const { isActive } = useActivity();

  return (
    <BottomSheetRoot open={isActive} onOpenChange={(open) => !open && pop()}>
      <BottomSheetContent
        showHandle
        showCloseButton={false}
        title="옵션 선택"
        description="각 옵션을 선택하면 상세 화면으로 이동합니다"
        layerIndex={useZIndexBase()}
      >
        <BottomSheetBody>
          <VStack gap="x2" py="x1">
            <ActionButton
              variant="neutralWeak"
              onClick={() => push("ActivityDetail", { title: "설정", body: "설정 화면입니다." })}
            >
              <PrefixIcon svg={<IconGearLine />} />
              설정
            </ActionButton>
            <ActionButton
              variant="neutralWeak"
              onClick={() =>
                push("ActivityDetail", { title: "도움말", body: "도움말 화면입니다." })
              }
            >
              <PrefixIcon svg={<IconILowercaseSerifCircleLine />} />
              도움말
            </ActionButton>
            <ActionButton
              variant="neutralWeak"
              onClick={() => push("ActivityBottomSheetNested", { title: "정보" })}
            >
              바텀 시트 또 열기
            </ActionButton>
          </VStack>
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton onClick={pop} variant="neutralSolid">
            닫기
          </ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityBottomSheetNested;
