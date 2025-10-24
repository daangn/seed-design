import { Slider, Text, VStack } from "@seed-design/react";
import { useState } from "react";

export default function SliderPreview() {
  const [values, setValues] = useState([10, 25]);

  return (
    <VStack width="full" bg="bg.layerDefault" p="x4">
      <Slider.Root min={0} max={100} step={1} values={values} onValuesChange={setValues}>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb thumbIndex={0} />
        <Slider.Thumb thumbIndex={1} />
      </Slider.Root>
      <Text>{JSON.stringify(values)}</Text>
    </VStack>
  );
}
