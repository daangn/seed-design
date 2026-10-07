import "./styles";

import { VStack } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Example() {
  return (
    <VStack className="radio-group-preview">
      <RadioGroup accessibility-label="글꼴 굵기 선택" defaultValue="regular">
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
