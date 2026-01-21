import { VStack, HStack, Text } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";
import { ActionButton } from "seed-design/ui/action-button";
import { useState } from "react";

const DEFAULT_VALUE = [50];

export default function SliderControlled() {
  const [value, setValue] = useState(DEFAULT_VALUE);

  return (
    <VStack gap="spacingY.componentDefault" width="full" align="center">
      <Slider
        min={0}
        max={100}
        values={value}
        onValuesChange={setValue}
        getAriaLabel={() => "값"}
      />
      <Text>{JSON.stringify(value)}</Text>
      <HStack gap="spacingY.componentDefault">
        <ActionButton type="button" onClick={() => setValue([0])} variant="neutralWeak">
          Set Min
        </ActionButton>
        <ActionButton type="button" onClick={() => setValue(DEFAULT_VALUE)} variant="neutralWeak">
          Reset
        </ActionButton>
        <ActionButton type="button" onClick={() => setValue([100])} variant="neutralWeak">
          Set Max
        </ActionButton>
      </HStack>
    </VStack>
  );
}
