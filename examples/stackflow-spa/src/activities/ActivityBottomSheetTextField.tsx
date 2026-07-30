import { VStack } from "@seed-design/react";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { useActivityZIndexBase } from "@seed-design/stackflow";

declare module "@stackflow/config" {
  interface Register {
    ActivityBottomSheetTextField: {};
  }
}

const ActivityBottomSheetTextField: StaticActivityComponentType<
  "ActivityBottomSheetTextField"
> = () => {
  const { pop } = useFlow();
  const activity = useActivity();

  const snackbar = useSnackbarAdapter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = new FormData(e.currentTarget).get("name");
    pop();

    snackbar.create({
      render: () => <Snackbar variant="positive" message={`입력한 이름: ${name}`} />,
    });
  };

  return (
    <BottomSheetRoot open={activity.isActive} onOpenChange={(open) => !open && pop()}>
      <BottomSheetContent
        showHandle
        showCloseButton={false}
        title="이름 입력"
        layerIndex={useActivityZIndexBase()}
      >
        <form onSubmit={handleSubmit}>
          <BottomSheetBody>
            <TextField name="name" label="이름">
              <TextFieldInput placeholder="이름을 입력하세요" />
            </TextField>
          </BottomSheetBody>
          <BottomSheetFooter>
            <VStack gap="x2">
              <ActionButton type="submit" variant="neutralSolid">
                제출
              </ActionButton>
            </VStack>
          </BottomSheetFooter>
        </form>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityBottomSheetTextField;
