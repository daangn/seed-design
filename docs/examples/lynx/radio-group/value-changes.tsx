import "./styles";

import { root, useState } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<string | null>(null);

  return (
    <page className={seedClassName}>
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
    </page>
  );
}

root.render(<Root />);
