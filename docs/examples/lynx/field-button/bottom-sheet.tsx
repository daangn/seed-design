import "./styles";

import { useState } from "@lynx-js/react";
import { ActionButton, BottomSheet, VStack } from "@seed-design/lynx-react";
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
      <BottomSheet.Root open={open} onOpenChange={setOpen}>
        <BottomSheet.Positioner>
          <BottomSheet.Backdrop />
          <BottomSheet.Content>
            <BottomSheet.Header>
              <BottomSheet.Title>동네 선택</BottomSheet.Title>
              <BottomSheet.Description>거래할 동네를 선택해주세요.</BottomSheet.Description>
            </BottomSheet.Header>
            <BottomSheet.Footer>
              <ActionButton variant="neutralSolid" bindtap={selectValue}>
                판교동 선택
              </ActionButton>
            </BottomSheet.Footer>
          </BottomSheet.Content>
        </BottomSheet.Positioner>
      </BottomSheet.Root>
    </VStack>
  );
}
