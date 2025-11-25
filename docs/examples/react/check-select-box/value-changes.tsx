import { VStack, Text } from "@seed-design/react";
import { CheckSelectBox, CheckSelectBoxGroup } from "seed-design/ui/select-box";
import { useState } from "react";

export default function CheckSelectBoxValueChanges() {
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<boolean | null>(null);

  return (
    <VStack gap="x4" align="center" width="full">
      <CheckSelectBoxGroup>
        <VStack gap="spacingY.componentDefault">
          <CheckSelectBox
            label="Apple"
            onCheckedChange={(checked) => {
              setCount((prev) => prev + 1);
              setLastValue(checked);
            }}
          />
        </VStack>
      </CheckSelectBoxGroup>
      <Text>
        onCheckedChange called: {count} times, last value: {`${lastValue ?? "-"}`}
      </Text>
    </VStack>
  );
}
