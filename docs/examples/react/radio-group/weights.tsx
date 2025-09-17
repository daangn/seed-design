import { RadioGroup, RadioGroupItem } from "@/registry/ui/radio-group";
import { HStack } from "@seed-design/react";

export default function RadioGroupWeights() {
  return (
    <RadioGroup defaultValue="regular" aria-label="글꼴 굵기 선택">
      <HStack gap="x3">
        <RadioGroupItem value="regular" label="Regular" weight="regular" />
        <RadioGroupItem value="bold" label="Bold" weight="bold" />
      </HStack>
    </RadioGroup>
  );
}
