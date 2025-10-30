import { VStack, Text } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";
import { useState } from "react";

export default function SliderRangeMinSteps() {
  const [values, setValues] = useState([20, 80]);

  return (
    <VStack gap="spacingY.componentDefault" width="full" align="center">
      <Slider
        min={0}
        max={100}
        values={values}
        onValuesChange={setValues}
        step={5}
        minStepsBetweenThumbs={6} // step이 5이므로, value의 최소 간격은 30이 됩니다.
        getAriaLabel={(thumbIndex) => (thumbIndex === 0 ? "최소값" : "최대값")}
      />
      <Text>{JSON.stringify(values)}</Text>
    </VStack>
  );
}
