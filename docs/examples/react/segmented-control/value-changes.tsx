import { VStack, Text } from "@seed-design/react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { useState } from "react";

export default function SegmentedControlValueChanges() {
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <SegmentedControl
        defaultValue="hot"
        aria-label="Sort by"
        onValueChange={(value) => {
          setCount((prev) => prev + 1);
          setLastValue(value);
        }}
      >
        <SegmentedControlItem value="hot">Hot</SegmentedControlItem>
        <SegmentedControlItem value="new">New</SegmentedControlItem>
      </SegmentedControl>
      <Text>
        onValueChange called: {count} times, last value: {lastValue ?? "-"}
      </Text>
    </VStack>
  );
}
