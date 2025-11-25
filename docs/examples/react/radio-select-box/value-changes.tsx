import { VStack, Text } from "@seed-design/react";
import { RadioSelectBoxItem, RadioSelectBoxRoot } from "seed-design/ui/select-box";
import { useState } from "react";

export default function RadioSelectBoxValueChanges() {
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <RadioSelectBoxRoot
        defaultValue="apple"
        aria-label="Fruit"
        onValueChange={(value) => {
          setCount((prev) => prev + 1);
          setLastValue(value);
        }}
      >
        <VStack gap="spacingY.componentDefault">
          <RadioSelectBoxItem value="apple" label="Apple" />
          <RadioSelectBoxItem value="banana" label="Banana" />
        </VStack>
      </RadioSelectBoxRoot>
      <Text>
        onValueChange called: {count} times, last value: {lastValue ?? "-"}
      </Text>
    </VStack>
  );
}
