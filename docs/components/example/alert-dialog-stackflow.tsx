import { useActivity } from "@stackflow/react";
import { ActivityComponentType, useFlow } from "@stackflow/react/future";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
} from "seed-design/ui/alert-dialog";

declare module "@stackflow/config" {
  interface Register {
    "alert-dialog-stackflow": unknown;
  }
}

const AlertDialogStackflow: ActivityComponentType<"alert-dialog-stackflow"> = () => {
  const activity = useActivity();
  const { pop } = useFlow();

  return (
    <AlertDialogRoot defaultOpen onOpenChange={(open) => !open && pop()}>
      <AlertDialogContent layerIndex={activity.zIndex * 5}>
        <AlertDialogHeader>
          <AlertDialogTitle>제목</AlertDialogTitle>
          <AlertDialogDescription>Stackflow</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default AlertDialogStackflow;
