import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";
import { HStack } from "@seed-design/react";

export default function RadioGroupNeutral() {
  return (
    <RadioGroup defaultValue="apple" aria-label="과일 선택">
      <HStack gap="x3">
        <RadioGroupItem value="apple" label="사과" tone="neutral" />
        <RadioGroupItem value="banana" label="바나나" tone="neutral" />
        <RadioGroupItem value="orange" label="오렌지" tone="neutral" />
      </HStack>
    </RadioGroup>
  );
}
