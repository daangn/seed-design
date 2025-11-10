import { useActivity, useFlow, type ActivityComponentType } from "@stackflow/react/future";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogRoot,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
} from "seed-design/ui/alert-dialog";
import {
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
} from "seed-design/ui/menu-sheet";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetSimple: {};
  }
}

const ActivityBottomSheetSimple: ActivityComponentType<"ActivityBottomSheetSimple"> = () => {
  const { pop } = useFlow();
  const { isActive } = useActivity();

  return (
    <BottomSheetRoot open={isActive} onOpenChange={(open) => !open && pop()}>
      <BottomSheetContent
        showHandle
        showCloseButton={false}
        title="Activity로 만들어진 BottomSheet"
      >
        <BottomSheetFooter>
          <ActionButton onClick={pop} variant="neutralSolid" size="large">
            확인
          </ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityBottomSheetSimple;
