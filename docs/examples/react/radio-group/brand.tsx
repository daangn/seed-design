import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group";
import { HStack } from "@seed-design/react";

export default function RadioGroupBrand() {
  return (
    <RadioGroup defaultValue="apple" aria-label="과일 선택">
      <HStack gap="x3">
        <RadioGroupItem value="apple" label="사과" tone="brand" />
        <RadioGroupItem value="banana" label="바나나" tone="brand" />
        <RadioGroupItem value="orange" label="오렌지" tone="brand" />
      </HStack>
    </RadioGroup>
  );
}
