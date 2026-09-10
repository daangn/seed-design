import "./styles";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-radio-group-root`}>
      <VStack className="radio-group-preview">
        <RadioGroup
          accessibility-label="Options with disabled"
          defaultValue="option1"
          size="large"
          tone="neutral"
        >
          <RadioGroupItem value="option1" label="Active option" />
          <RadioGroupItem value="option2" label="Disabled option" disabled />
          <RadioGroupItem value="option3" label="Another active option" />
        </RadioGroup>
      </VStack>
    </view>
  );
}
