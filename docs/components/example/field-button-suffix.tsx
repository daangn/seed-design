"use client";

import { useState } from "react";
import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";
import { IconWonLine } from "@karrotmarket/react-monochrome-icon";

export default function FieldButtonSuffix() {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        suffix="cm"
        values={[value1]}
        onValuesChange={([value]) => setValue1(value)}
        onButtonClick={() => {
          setValue1(value1 ? "" : "180");
        }}
      >
        <FieldButtonValue placeholder="클릭해서 값 채우기">
          {value1}
        </FieldButtonValue>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        suffixIcon={<IconWonLine />}
        values={[value2]}
        onValuesChange={([value]) => setValue2(value)}
        onButtonClick={() => {
          setValue2(value2 ? "" : "50,000");
        }}
      >
        <FieldButtonValue placeholder="클릭해서 값 채우기">
          {value2}
        </FieldButtonValue>
      </FieldButton>
    </HStack>
  );
}