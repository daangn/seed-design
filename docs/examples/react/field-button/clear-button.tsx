import { FieldButton, FieldButtonValue, FieldButtonPlaceholder } from "seed-design/ui/field-button";
import { useState } from "react";

export default function FieldButtonFormControl() {
  const [value, setValue] = useState(
    "Do nostrud duis deserunt occaecat sit ex veniam fugiat commodo voluptate voluptate.",
  );

  return (
    <FieldButton
      values={[value]}
      onValuesChange={([value]) => setValue(value ?? "")}
      showClearButton={value !== ""}
      buttonProps={{
        onClick: () => setValue(window.prompt("값을 입력해주세요") || value),
        "aria-label": `값 입력.${value ? ` 현재 값은 ${value}입니다.` : ""}`,
      }}
    >
      {value ? (
        <FieldButtonValue>입력한 값: {value}</FieldButtonValue>
      ) : (
        <FieldButtonPlaceholder>값을 입력하려면 클릭하세요</FieldButtonPlaceholder>
      )}
    </FieldButton>
  );
}
