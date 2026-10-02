import "./styles";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-radio-group-root`}>
      <VStack className="radio-group-preview">
        <RadioGroup accessibility-label="Options with disabled" defaultValue="option1">
          <RadioGroupItem value="option1" label="Active option" tone="neutral" size="large" />
          <RadioGroupItem
            value="option2"
            label="Disabled option"
            tone="neutral"
            size="large"
            disabled
          />
          <RadioGroupItem
            value="option3"
            label="Another active option"
            tone="neutral"
            size="large"
          />
        </RadioGroup>
      </VStack>
    </view>
  );
}
