import { VStack, Text } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";
import { useState } from "react";

const ALLOWED_VALUES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

export default function SliderAllowedValues() {
  const [values, setValues] = useState([ALLOWED_VALUES[0], ALLOWED_VALUES[2]]);

  return (
    <VStack gap="spacingY.componentDefault" width="full" align="center">
      <Slider
        min={0}
        max={30}
        values={values}
        onValuesChange={setValues}
        allowedValues={ALLOWED_VALUES}
        markers={ALLOWED_VALUES.map((value) => ({ label: value, value }))}
        getAriaLabel={() => "값"}
      />
      <Text>{JSON.stringify(values)}</Text>
    </VStack>
  );
}
