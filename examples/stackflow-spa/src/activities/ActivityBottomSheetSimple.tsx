import { useActivity, useFlow, type ActivityComponentType } from "@stackflow/react/future";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetSimple: {};
  }
}

const ActivityBottomSheetSimple: ActivityComponentType<"ActivityBottomSheetSimple"> = () => {
  const { pop } = useFlow();
  const activity = useActivity();

  const handleClose = (open: boolean) => {
    if (!open) pop();
  };

  return (
    <BottomSheetRoot open={activity.isActive} onOpenChange={handleClose}>
      <BottomSheetContent
        showHandle
        showCloseButton={false}
        title="Activity로 만들어진 BottomSheet"
      >
        <BottomSheetFooter>
          <ActionButton onClick={() => pop()} variant="neutralSolid" size="large">
            확인
          </ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityBottomSheetSimple;
