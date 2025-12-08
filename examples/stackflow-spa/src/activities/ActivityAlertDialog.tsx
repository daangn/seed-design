import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";

import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
} from "seed-design/ui/alert-dialog";
import { ResponsivePair } from "@seed-design/react";
import { send } from "@stackflow/compat-await-push";
import { useActivityZIndexBase } from "@seed-design/stackflow";

declare module "@stackflow/config" {
  interface Register {
    ActivityAlertDialog: {};
  }
}

const ActivityAlertDialog: StaticActivityComponentType<"ActivityAlertDialog"> = () => {
  const activity = useActivity();
  const { pop, push } = useFlow();

  const handleClose = (open: boolean) => {
    if (!open) {
      pop();
      send({
        activityId: activity.id,
        data: {
          message: "hello",
        },
      });
    }
  };

  return (
    <AlertDialogRoot open={activity.isActive} onOpenChange={handleClose}>
      <AlertDialogContent layerIndex={useActivityZIndexBase()}>
        <AlertDialogHeader>
          <AlertDialogTitle>제목</AlertDialogTitle>
          <AlertDialogDescription>다람쥐 헌 쳇바퀴에 타고파</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <ResponsivePair gap="x2">
            <AlertDialogAction asChild>
              <ActionButton variant="neutralWeak">확인</ActionButton>
            </AlertDialogAction>
            <ActionButton
              variant="neutralSolid"
              onClick={() =>
                push("ActivityDetail", {
                  title: "AlertDialog에서 Push됨",
                  body: "다람쥐 헌 쳇바퀴에 타고파",
                })
              }
            >
              Push
            </ActionButton>
          </ResponsivePair>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default ActivityAlertDialog;
