"use client";

import { useState } from "react";
import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";
import { IconMagnifyingglassLine } from "@karrotmarket/react-monochrome-icon";

export default function FieldButtonPrefix() {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        prefix="https://"
        values={[value1]}
        onValuesChange={([value]) => setValue1(value)}
        onButtonClick={() => {
          setValue1(value1 ? "" : "example.com");
        }}
      >
        <FieldButtonValue placeholder="클릭해서 값 채우기">
          {value1}
        </FieldButtonValue>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        prefixIcon={<IconMagnifyingglassLine />}
        values={[value2]}
        onValuesChange={([value]) => setValue2(value)}
        onButtonClick={() => {
          setValue2(value2 ? "" : "검색 결과");
        }}
      >
        <FieldButtonValue placeholder="클릭해서 값 채우기">
          {value2}
        </FieldButtonValue>
      </FieldButton>
    </HStack>
  );
}
