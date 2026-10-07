import "./styles";

import { VStack } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Example() {
  return (
    <VStack className="radio-group-preview">
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
