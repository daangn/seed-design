import { VStack, Text } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";
import { useState } from "react";

export default function RadioGroupValueChanges() {
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center" width="full" p="x6">
      <RadioGroup
        defaultValue="apple"
        aria-label="Fruit selection"
        onValueChange={(value) => {
          setCount((prev) => prev + 1);
          setLastValue(value);
        }}
      >
        <RadioGroupItem value="apple" label="Apple" tone="neutral" size="large" />
        <RadioGroupItem value="banana" label="Banana" tone="neutral" size="large" />
        <RadioGroupItem value="orange" label="Orange" tone="neutral" size="large" />
      </RadioGroup>
      <Text>
        onValueChange called: {count} times, last value: {lastValue ?? "-"}
      </Text>
    </VStack>
  );
}
