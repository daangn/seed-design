import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";

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
import { ResponsivePair, VStack } from "@seed-design/react";
import { send } from "@stackflow/compat-await-push";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { Switch } from "seed-design/ui/switch";

declare module "@stackflow/config" {
  interface Register {
    ActivityAlertDialog: {};
  }
}

const ActivityAlertDialog: StaticActivityComponentType<"ActivityAlertDialog"> = () => {
  const activity = useActivity();
  const { pop, push } = useFlow();

  const [keepMounted, setKeepMounted] = useState(false);

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

  const open = keepMounted
    ? activity.transitionState === "enter-active" || activity.transitionState === "enter-done"
    : activity.isActive;

  const onOpenChange = keepMounted
    ? (open: boolean) => !open && activity.isActive && handleClose(open)
    : handleClose;

  return (
    <AlertDialogRoot
      open={open}
      modal={keepMounted ? activity.isActive : undefined}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent layerIndex={useActivityZIndexBase()}>
        <AlertDialogHeader>
          <AlertDialogTitle>제목</AlertDialogTitle>
          <AlertDialogDescription>다람쥐 헌 쳇바퀴에 타고파</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <VStack gap="x4">
            <ResponsivePair gap="x2">
              <AlertDialogAction asChild>
                <ActionButton variant="neutralWeak">확인</ActionButton>
              </AlertDialogAction>
              <ActionButton
                variant="neutralSolid"
                onClick={() =>
                  push("ActivityDetail", {
                    title: "AlertDialog에서 Push됨",
                    body: keepMounted
                      ? "AlertDialog가 언마운트되지 않았으므로, 현재 Activity를 pop하는 경우 AlertDialog가 열린 상태로 표시됩니다."
                      : "AlertDialog가 언마운트되었으므로, 현재 Activity를 pop하는 경우 AlertDialog가 다시 enter 트랜지션을 재생하며 마운트됩니다.",
                  })
                }
              >
                Push
              </ActionButton>
            </ResponsivePair>
            <Switch
              tone="neutral"
              size="16"
              label="Push 이후에도 AlertDialog 마운트 유지"
              checked={keepMounted}
              onCheckedChange={setKeepMounted}
              style={{ alignSelf: "center" }}
            />
          </VStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default ActivityAlertDialog;
