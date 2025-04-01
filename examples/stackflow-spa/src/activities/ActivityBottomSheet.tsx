import { useActivity, type ActivityComponentType } from "@stackflow/react";

import { ActionButton } from "../seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "../seed-design/ui/bottom-sheet";
import { useFlow } from "../stackflow";

const ActivityBottomSheet: ActivityComponentType = () => {
  const { pop } = useFlow();
  const activity = useActivity();

  const handleClose = (open: boolean) => {
    if (!open) {
      pop();
    }
  };

  return (
    <BottomSheetRoot open={activity.isActive} onOpenChange={handleClose}>
      <BottomSheetContent
        title="제목"
        description="다람쥐 헌 쳇바퀴에 타고파"
        layerIndex={activity.zIndex * 5}
      >
        <BottomSheetBody alignItems="center" justifyContent="center" height="300px">
          Content
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton onClick={() => pop()} variant="neutralSolid" size="large">
            확인
          </ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityBottomSheet;
