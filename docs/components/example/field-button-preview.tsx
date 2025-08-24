"use client";

import { useState } from "react";
import { FieldButton } from "seed-design/ui/field-button";
import {
  BottomSheetRoot,
  BottomSheetContent,
  BottomSheetBody,
  BottomSheetFooter,
} from "seed-design/ui/bottom-sheet";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { ActionButton } from "seed-design/ui/action-button";
import { Portal } from "@seed-design/react";

export default function FieldButtonPreview() {
  const [address, setAddress] = useState("");
  const [draft, setDraft] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <BottomSheetRoot open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <FieldButton
        values={[address]}
        onValuesChange={([value]) => setAddress(value)}
        onButtonClick={() => setIsSheetOpen(true)}
        label="레이블"
        description="Officia in aute cillum non commodo sit dolor occaecat cillum cillum amet mollit."
      >
        <div>{address}</div>
      </FieldButton>
      <Portal>
        <BottomSheetContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();

              setAddress(draft);
              setIsSheetOpen(false);

              // event.stopPropagation();
            }}
          >
            <BottomSheetBody minHeight="x16">
              <TextField
                label="주소를 입력해 주세요"
                value={draft}
                onValueChange={({ value }) => setDraft(value)}
              >
                <TextFieldInput type="text" placeholder="서울특별시" />
              </TextField>
            </BottomSheetBody>
            <BottomSheetFooter>
              <ActionButton type="submit" variant="neutralSolid">
                확인
              </ActionButton>
            </BottomSheetFooter>
          </form>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  );
}
