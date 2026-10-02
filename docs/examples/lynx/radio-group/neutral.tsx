import "./styles";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-radio-group-root`}>
      <VStack className="radio-group-preview">
        <RadioGroup accessibility-label="과일 선택" defaultValue="apple">
          <RadioGroupItem value="apple" label="사과" tone="neutral" size="large" />
          <RadioGroupItem value="banana" label="바나나" tone="neutral" size="large" />
          <RadioGroupItem value="orange" label="오렌지" tone="neutral" size="large" />
        </RadioGroup>
      </VStack>
    </view>
  );
}
