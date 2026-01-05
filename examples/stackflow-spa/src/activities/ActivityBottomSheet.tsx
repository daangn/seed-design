import { Divider, HStack, VStack } from "@seed-design/react";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
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
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { Switch } from "seed-design/ui/switch";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheet: {};
  }
}

const ActivityBottomSheet: StaticActivityComponentType<"ActivityBottomSheet"> = () => {
  const { push, pop } = useFlow();
  const activity = useActivity();

  const form = useRef<HTMLFormElement>(null);

  const snackbar = useSnackbarAdapter();

  const [nameError, setNameError] = useState<string | null>(null);
  const [keepMounted, setKeepMounted] = useState(false);

  const handleSubmit = () => {
    if (!form.current) return;
    const formData = new FormData(form.current);

    if (!formData.get("name")) {
      setNameError("이름을 입력해주세요.");

      return;
    }

    setNameError(null);
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
  };

  const open = keepMounted
    ? activity.transitionState === "enter-active" || activity.transitionState === "enter-done"
    : activity.isActive;

  const onOpenChange = keepMounted
    ? (open: boolean) => !open && activity.isActive && pop()
    : (open: boolean) => !open && pop();

  return (
    <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent
        showHandle
        showCloseButton={false}
        title="정보 입력"
        layerIndex={useActivityZIndexBase()}
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
              >
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
            <VStack gap="x4">
              <HStack gap="x2">
                <ActionButton type="button" variant="neutralWeak" onClick={pop}>
                  닫기
                </ActionButton>
                <ActionButton type="submit" variant="neutralSolid" flexGrow>
                  제출
                </ActionButton>
              </HStack>
              <Divider as="div" />
              <VStack gap="x2">
                <ActionButton
                  flexGrow
                  type="button"
                  variant="neutralWeak"
                  onClick={() =>
                    push("ActivityDetail", {
                      title: "Activity",
                      body: keepMounted
                        ? "BottomSheet가 언마운트되지 않았으므로, 현재 Activity를 pop하는 경우 uncontrolled 상태의 TextField와 Checkbox 값이 유지되며 BottomSheet가 열린 상태로 표시됩니다."
                        : "BottomSheet가 언마운트되었으므로, 현재 Activity를 pop하는 경우 uncontrolled 상태의 TextField와 Checkbox 값이 초기화되며 BottomSheet가 다시 enter 트랜지션을 재생하며 마운트됩니다.",
                    })
                  }
                >
                  Push
                </ActionButton>
                <Switch
                  tone="neutral"
                  size="16"
                  label="Push 이후에도 BottomSheet 마운트 유지"
                  checked={keepMounted}
                  onCheckedChange={setKeepMounted}
                  style={{ alignSelf: "center" }}
                />
              </VStack>
            </VStack>
          </BottomSheetFooter>
        </form>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityBottomSheet;
