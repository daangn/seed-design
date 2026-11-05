import "./styles";

import { useState } from "@lynx-js/react";
import { VStack } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Example() {
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<string | null>(null);

  return (
    <VStack className="radio-group-preview" gap="x4">
      <RadioGroup
        accessibility-label="Fruit selection"
        defaultValue="apple"
        onValueChange={(value) => {
          setCount((previous) => previous + 1);
          setLastValue(value);
        }}
      >
        <RadioGroupItem value="apple" label="Apple" tone="neutral" size="large" />
        <RadioGroupItem value="banana" label="Banana" tone="neutral" size="large" />
        <RadioGroupItem value="orange" label="Orange" tone="neutral" size="large" />
      </RadioGroup>
      <text className="radio-group-preview__status">
        onValueChange called: {count} times, last value: {lastValue ?? "-"}
      </text>
    </VStack>
  );
}
