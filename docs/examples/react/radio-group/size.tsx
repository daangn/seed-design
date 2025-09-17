import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group";
import { VStack, HStack } from "@seed-design/react";

export default function RadioGroupSize() {
  return (
    <VStack gap="x5">
      <RadioGroup defaultValue="apple" aria-label="과일 선택">
        <HStack gap="x3">
          <RadioGroupItem value="apple" label="사과" size="medium" />
          <RadioGroupItem value="banana" label="바나나" size="medium" />
          <RadioGroupItem value="orange" label="오렌지" size="medium" />
        </HStack>
      </RadioGroup>
      <RadioGroup defaultValue="red" aria-label="색상 선택">
        <HStack gap="x3">
          <RadioGroupItem value="red" label="빨간색" size="large" />
          <RadioGroupItem value="blue" label="파란색" size="large" />
          <RadioGroupItem value="green" label="초록색" size="large" />
        </HStack>
      </RadioGroup>
    </VStack>
  );
}
