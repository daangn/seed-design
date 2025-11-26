import { VStack, Text } from "@seed-design/react";
import { Switch } from "seed-design/ui/switch";
import { useState } from "react";

export default function SwitchValueChanges() {
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<boolean | null>(null);

  return (
    <VStack gap="x4" align="center">
      <Switch
        label="Click me"
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
