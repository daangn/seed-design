import { useActivityZIndexBase } from "@seed-design/stackflow";
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
    "react/alert-dialog/stackflow": {};
  }
}

const AlertDialogStackflow: ActivityComponentType<"react/alert-dialog/stackflow"> = () => {
  const { pop } = useFlow();

  return (
    <AlertDialogRoot defaultOpen onOpenChange={(open) => !open && pop()}>
      <AlertDialogContent layerIndex={useActivityZIndexBase()}>
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
