import "./styles";

import { useState } from "@lynx-js/react";
import { VStack } from "@seed-design/lynx-react";
import {
  FieldButton,
  FieldButtonPlaceholder,
  FieldButtonValue,
} from "@/components/ui/field-button";

export default function Example() {
  const [value, setValue] = useState("판교동");

  function selectValue() {
    "background only";
    setValue("정자동");
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
          bindtap: selectValue,
          "accessibility-label": `동네 선택.${value ? ` 현재 동네는 ${value}입니다.` : ""}`,
        }}
      >
        {value ? (
          <FieldButtonValue>{value}</FieldButtonValue>
        ) : (
          <FieldButtonPlaceholder>동네를 선택해주세요</FieldButtonPlaceholder>
        )}
      </FieldButton>
    </VStack>
  );
}
