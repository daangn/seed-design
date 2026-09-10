import "./styles";

import { useState } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<string | null>(null);

  return (
    <view className={`${seedClassName} docs-lynx-radio-group-root`}>
      <VStack className="radio-group-preview" gap="x4">
        <RadioGroup
          accessibility-label="Fruit selection"
          defaultValue="apple"
          size="large"
          tone="neutral"
          onValueChange={(value) => {
            setCount((previous) => previous + 1);
            setLastValue(value);
          }}
        >
          <RadioGroupItem value="apple" label="Apple" />
          <RadioGroupItem value="banana" label="Banana" />
          <RadioGroupItem value="orange" label="Orange" />
        </RadioGroup>
        <text className="radio-group-preview__status">
          onValueChange called: {count} times, last value: {lastValue ?? "-"}
        </text>
      </VStack>
    </view>
  );
}
