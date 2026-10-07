import "./styles";

import { VStack } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Example() {
  return (
    <VStack className="radio-group-preview" gap="x5">
      <RadioGroup accessibility-label="과일 선택" defaultValue="apple">
        <RadioGroupItem value="apple" label="사과" size="medium" tone="neutral" />
        <RadioGroupItem value="banana" label="바나나" size="medium" tone="neutral" />
        <RadioGroupItem value="orange" label="오렌지" size="medium" tone="neutral" />
      </RadioGroup>
      <RadioGroup accessibility-label="색상 선택" defaultValue="red">
        <RadioGroupItem value="red" label="빨간색" size="large" tone="neutral" />
        <RadioGroupItem value="blue" label="파란색" size="large" tone="neutral" />
        <RadioGroupItem value="green" label="초록색" size="large" tone="neutral" />
      </RadioGroup>
    </VStack>
  );
}
