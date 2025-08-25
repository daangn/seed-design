"use client";

import { useState } from "react";
import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";

export default function FieldButtonXLarge() {
  const [value, setValue] = useState("");

  return (
    <FieldButton
      size="xlarge"
      label="XLarge 사이즈"
      description="설명을 써주세요"
      values={[value]}
      onValuesChange={([value]) => setValue(value)}
      onButtonClick={() => {
        setValue(value ? "" : "클릭해서 값 비우기");
      }}
    >
      <FieldButtonValue placeholder="클릭해서 값 채우기">
        {value}
      </FieldButtonValue>
    </FieldButton>
  );
}