import "./styles";

import { useState } from "@lynx-js/react";
import { ActionButton, VStack } from "@seed-design/lynx-react";
import {
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "@/components/ui/bottom-sheet";
import {
  FieldButton,
  FieldButtonPlaceholder,
  FieldButtonValue,
} from "@/components/ui/field-button";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  function openPicker() {
    "background only";
    setOpen(true);
  }

  function selectValue() {
    "background only";
    setValue("판교동");
    setOpen(false);
  }

  function changeValues([nextValue = ""]: string[]) {
    "background only";
    setValue(nextValue);
  }

  return (
    <VStack className="field-button-preview__content">
      <FieldButton
        label="동네"
        values={value ? [value] : []}
        onValuesChange={changeValues}
        showClearButton={value !== ""}
        buttonProps={{
          bindtap: openPicker,
          "accessibility-label": value ? `동네 변경. 현재: ${value}` : "동네 선택",
        }}
      >
        {value ? (
          <FieldButtonValue>{value}</FieldButtonValue>
        ) : (
          <FieldButtonPlaceholder>동네를 선택해주세요</FieldButtonPlaceholder>
        )}
      </FieldButton>
      <BottomSheetRoot open={open} onOpenChange={setOpen}>
        <BottomSheetContent title="동네 선택" description="거래할 동네를 선택해주세요.">
          <BottomSheetFooter>
            <ActionButton variant="neutralSolid" bindtap={selectValue}>
              판교동 선택
            </ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>
    </VStack>
  );
}
