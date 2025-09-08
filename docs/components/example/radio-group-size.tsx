"use client";

import { RadioGroup, RadioGroupItem } from "../../registry/ui/radio-group";
import { VStack, Text, HStack } from "@seed-design/react";
import { useState } from "react";

export default function RadioGroupSize() {
  const [mediumValue, setMediumValue] = useState("apple");
  const [largeValue, setLargeValue] = useState("red");

  return (
    <VStack gap="x5">
      <VStack gap="x3">
        <Text as="h3" color="fg.neutral" fontSize="t4" fontWeight="bold">
          Medium (기본값)
        </Text>
        <RadioGroup
          value={mediumValue}
          onValueChange={setMediumValue}
          aria-label="과일 선택 (중간 크기)"
        >
          <HStack gap="x3">
            <RadioGroupItem value="apple" label="사과" size="medium" />
            <RadioGroupItem value="banana" label="바나나" size="medium" />
            <RadioGroupItem value="orange" label="오렌지" size="medium" />
          </HStack>
        </RadioGroup>
      </VStack>

      <VStack gap="x3">
        <Text as="h3" color="fg.neutral" fontSize="t4" fontWeight="bold">
          Large
        </Text>
        <RadioGroup
          value={largeValue}
          onValueChange={setLargeValue}
          aria-label="색상 선택 (큰 크기)"
        >
          <HStack gap="x3">
            <RadioGroupItem value="red" label="빨간색" size="large" />
            <RadioGroupItem value="blue" label="파란색" size="large" />
            <RadioGroupItem value="green" label="초록색" size="large" />
          </HStack>
        </RadioGroup>
      </VStack>
    </VStack>
  );
}
