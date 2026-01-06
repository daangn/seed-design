import { VStack, Text, type SliderRootProps } from "@seed-design/react";
import { useState } from "react";
import { Slider } from "seed-design/ui/slider";

const getAriaLabel: NonNullable<SliderRootProps["getAriaLabel"]> = (thumbIndex) =>
  thumbIndex === 0 ? "최소값" : "최대값";

export default function SliderGetAriaLabel() {
  const [values, setValues] = useState([10, 30]);

  return (
    <VStack gap="spacingY.componentDefault" width="full" align="center">
      <Slider
        min={0}
        max={100}
        values={values}
        onValuesChange={setValues}
        getAriaLabel={getAriaLabel}
      />
      <Text>values: {JSON.stringify(values)}</Text>
      <Text>aria-label: {JSON.stringify(values.map((_, index) => getAriaLabel(index)))}</Text>
    </VStack>
  );
}
