import { VStack, Text, HStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";
import { useState } from "react";

export default function SliderOnValuesCommit() {
  const [value, setValue] = useState([20]);
  const [committedValue, setCommittedValue] = useState([20]);

  return (
    <VStack gap="x4" width="full" align="center">
      <Slider
        min={0}
        max={100}
        values={value}
        onValuesChange={setValue}
        onValuesCommit={setCommittedValue}
        getAriaLabel={() => "값"}
      />
      <HStack gap="x4">
        <Text>Current value: {JSON.stringify(value)}</Text>
        <Text>Committed value: {JSON.stringify(committedValue)}</Text>
      </HStack>
    </VStack>
  );
}
