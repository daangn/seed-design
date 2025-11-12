import { HStack, VStack } from "@seed-design/react";
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
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { useZIndexBase } from "@seed-design/stackflow";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetForm: {};
  }
}

const ActivityBottomSheetForm: ActivityComponentType<"ActivityBottomSheetForm"> = () => {
  const { pop } = useFlow();

  const activity = useActivity();

  const form = useRef<HTMLFormElement>(null);

  const snackbar = useSnackbarAdapter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!form.current) return;
    const formData = new FormData(form.current);

    if (!formData.get("name")) {
      setNameError("이름을 입력해주세요.");

      return;
    }

    setNameError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      pop();

      snackbar.create({
        render: () => (
          <Snackbar
            variant="positive"
            message={JSON.stringify({
              name: formData.get("name"),
              subscribe: formData.get("subscribe"),
            })}
          />
        ),
      });
    }, 500);
  };

  return (
    <BottomSheetRoot open={activity.isActive} onOpenChange={(open) => !open && pop()}>
      <BottomSheetContent
        showHandle
        showCloseButton={false}
        title="정보 입력"
        layerIndex={useZIndexBase()}
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
              <TextField
                required
                showRequiredIndicator
                name="name"
                label="이름"
                description="본명이 아니어도 괜찮아요."
                invalid={!!nameError}
                errorMessage={nameError}
                disabled={isSubmitting}
              >
                <TextFieldInput placeholder="이름을 입력하세요" />
              </TextField>
              <Checkbox
                label="뉴스레터 구독하기"
                tone="neutral"
                inputProps={{ name: "subscribe" }}
                disabled={isSubmitting}
              />
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            <HStack gap="x2">
              <ActionButton
                type="button"
                onClick={pop}
                variant="neutralWeak"
                size="large"
                disabled={isSubmitting}
              >
                취소
              </ActionButton>
              <ActionButton
                type="submit"
                variant="neutralSolid"
                size="large"
                flexGrow
                disabled={isSubmitting}
                loading={isSubmitting}
              >
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
