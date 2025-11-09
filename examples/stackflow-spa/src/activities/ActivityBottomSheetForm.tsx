import { HStack, VStack, useSnackbarAdapter } from "@seed-design/react";
import { useActivity, useFlow, type ActivityComponentType } from "@stackflow/react/future";
import { useRef, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import { Checkbox } from "seed-design/ui/checkbox";
import { Snackbar } from "seed-design/ui/snackbar";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetForm: {};
  }
}

const ActivityBottomSheetForm: ActivityComponentType<"ActivityBottomSheetForm"> = () => {
  const { pop } = useFlow();

  const activity = useActivity();
  const snackbarAdapter = useSnackbarAdapter();

  const form = useRef<HTMLFormElement>(null);
  const handleSubmit = () => {
    if (!form.current) return;
    const formData = new FormData(form.current);

    if (!formData.get("name")) {
      snackbarAdapter.create({
        render: () => (
          <Snackbar
            variant="critical"
            message="이름을 입력해주세요."
            actionLabel="확인"
            onAction={snackbarAdapter.dismiss}
          />
        ),
      });

      return;
    }

    snackbarAdapter.create({
      render: () => (
        <Snackbar
          variant="positive"
          message={JSON.stringify(
            { name: formData.get("name"), subscribe: formData.get("subscribe") },
            null,
            2,
          )}
          actionLabel="확인"
          onAction={snackbarAdapter.dismiss}
        />
      ),
    });

    pop();
  };

  const handleClose = (open: boolean) => {
    if (!open) pop();
  };

  return (
    <BottomSheetRoot open={activity.isActive} onOpenChange={handleClose}>
      <BottomSheetContent
        showHandle
        showCloseButton={false}
        title="정보 입력"
        layerIndex={activity.zIndex + 4}
      >
        <form
          ref={form}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <BottomSheetBody>
            <VStack gap="spacingY.componentDefault">
              <TextField required showRequiredIndicator name="name" label="이름">
                <TextFieldInput placeholder="이름을 입력하세요" />
              </TextField>
              <Checkbox
                label="뉴스레터 구독하기"
                tone="neutral"
                inputProps={{ name: "subscribe" }}
              />
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            <HStack gap="x2">
              <ActionButton type="button" onClick={() => pop()} variant="neutralWeak" size="large">
                취소
              </ActionButton>
              <ActionButton type="submit" variant="neutralSolid" size="large" flexGrow>
                제출
              </ActionButton>
            </HStack>
          </BottomSheetFooter>
        </form>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityBottomSheetForm;
