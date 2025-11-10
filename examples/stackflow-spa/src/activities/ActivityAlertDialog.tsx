import { useActivity, useFlow, type ActivityComponentType } from "@stackflow/react/future";

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
import { VStack } from "@seed-design/react";
import { send } from "@stackflow/compat-await-push";

declare module "@stackflow/config" {
  interface Register {
    ActivityAlertDialog: {};
  }
}

const ActivityAlertDialog: ActivityComponentType<"ActivityAlertDialog"> = () => {
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>제목</AlertDialogTitle>
          <AlertDialogDescription>다람쥐 헌 쳇바퀴에 타고파</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <VStack gap="x2">
            <AlertDialogAction asChild>
              <ActionButton>확인</ActionButton>
            </AlertDialogAction>
            <ActionButton variant="neutralSolid" onClick={() => push("ActivityChipButton", {})}>
              Push
            </ActionButton>
          </VStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default ActivityAlertDialog;
