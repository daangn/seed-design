import { VStack, Text } from "@seed-design/react";
import { Checkbox } from "seed-design/ui/checkbox";
import { useState } from "react";

export default function CheckboxValueChanges() {
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<boolean | null>(null);

  return (
    <VStack gap="x4" align="center" p="x6">
      <Checkbox
        label="Click me"
        tone="neutral"
        size="large"
        onCheckedChange={(checked) => {
          setCount((prev) => prev + 1);
          setLastValue(checked);
        }}
      />
      <Text>
        onCheckedChange called: {count} times, last value: {`${lastValue ?? "-"}`}
      </Text>
    </VStack>
  );
}
