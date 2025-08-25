"use client";

import { useState } from "react";
import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";

export default function FieldButtonReadOnly() {
  const [value1] = useState("읽기 전용 값");
  const [value2] = useState("읽기 전용 값");

  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        readOnly
        values={[value1]}
      >
        <FieldButtonValue placeholder="플레이스홀더">
          {value1}
        </FieldButtonValue>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        readOnly
        invalid
        errorMessage="오류가 발생한 이유를 써주세요"
        values={[value2]}
      >
        <FieldButtonValue placeholder="플레이스홀더">
          {value2}
        </FieldButtonValue>
      </FieldButton>
    </HStack>
  );
}