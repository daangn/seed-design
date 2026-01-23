import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupWeights() {
  return (
    <VStack p="x6">
      <RadioGroup defaultValue="regular" aria-label="글꼴 굵기 선택">
        <RadioGroupItem
          value="regular"
          label="Regular"
          weight="regular"
          tone="neutral"
          size="large"
        />
        <RadioGroupItem value="bold" label="Bold" weight="bold" tone="neutral" size="large" />
      </RadioGroup>
    </VStack>
  );
}
