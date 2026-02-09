import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";
import { VStack } from "@seed-design/react";

export default function RadioGroupSize() {
  return (
    <VStack gap="x5" p="x6">
      <RadioGroup defaultValue="apple" aria-label="과일 선택">
        <RadioGroupItem value="apple" label="사과" size="medium" tone="neutral" />
        <RadioGroupItem value="banana" label="바나나" size="medium" tone="neutral" />
        <RadioGroupItem value="orange" label="오렌지" size="medium" tone="neutral" />
      </RadioGroup>
      <RadioGroup defaultValue="red" aria-label="색상 선택">
        <RadioGroupItem value="red" label="빨간색" size="large" tone="neutral" />
        <RadioGroupItem value="blue" label="파란색" size="large" tone="neutral" />
        <RadioGroupItem value="green" label="초록색" size="large" tone="neutral" />
      </RadioGroup>
    </VStack>
  );
}
