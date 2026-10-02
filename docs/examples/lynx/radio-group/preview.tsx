import "./styles";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-radio-group-root`}>
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
    </view>
  );
}
