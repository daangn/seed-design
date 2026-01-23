import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupBrand() {
  return (
    <VStack p="x6">
      <RadioGroup defaultValue="apple" aria-label="과일 선택">
        <RadioGroupItem value="apple" label="사과" tone="brand" size="large" />
        <RadioGroupItem value="banana" label="바나나" tone="brand" size="large" />
        <RadioGroupItem value="orange" label="오렌지" tone="brand" size="large" />
      </RadioGroup>
    </VStack>
  );
}
