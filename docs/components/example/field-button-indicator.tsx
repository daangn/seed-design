"use client";

import { useState } from "react";
import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";

export default function FieldButtonIndicator() {
  const [value, setValue] = useState("");

  return (
    <FieldButton
      label="선택사항"
      indicator="(옵션)"
      description="이 필드는 선택사항입니다"
      values={[value]}
      onValuesChange={([value]) => setValue(value)}
      onButtonClick={() => {
        setValue(value ? "" : "클릭해서 값 비우기");
      }}
    >
      <FieldButtonValue placeholder="클릭해서 값 채우기">{value}</FieldButtonValue>
    </FieldButton>
  );
}
