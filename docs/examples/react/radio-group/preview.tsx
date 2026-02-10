import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupPreview() {
  return (
    <VStack p="x6">
      <RadioGroup
        defaultValue="apple"
        label="좋아하는 과일"
        description="좋아하는 과일을 선택해 주세요."
        indicator="선택"
      >
        <RadioGroupItem value="apple" label="Apple" tone="neutral" size="large" />
        <RadioGroupItem value="banana" label="Banana" tone="neutral" size="large" />
        <RadioGroupItem value="orange" label="Orange" tone="neutral" size="large" />
      </RadioGroup>
    </VStack>
  );
}
