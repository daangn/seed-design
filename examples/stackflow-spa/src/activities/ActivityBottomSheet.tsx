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
    ActivityBottomSheet: {};
  }
}

const ActivityBottomSheet: ActivityComponentType<"ActivityBottomSheet"> = () => {
  const { pop } = useFlow();
  const activity = useActivity();

  return (
    <BottomSheetRoot open={activity.isActive} onOpenChange={(open) => !open && pop()}>
      <BottomSheetContent
        showHandle={true}
        title="제목"
        description="다람쥐 헌 쳇바퀴에 타고파"
        layerIndex={useZIndexBase()}
      >
        <BottomSheetBody alignItems="center" justifyContent="center" height="300px">
          Handle을 드래그하여 시트를 조절할 수 있습니다.
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton onClick={pop} variant="neutralSolid" size="large">
            확인
          </ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityBottomSheet;
