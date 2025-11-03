import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderMarkers() {
  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Slider
        min={0}
        max={100}
        defaultValues={[50]}
        markers={[
          { value: 0, label: "0°C" },
          { value: 25, label: "25°C" },
          { value: 50, label: "50°C" },
          { value: 75, label: "75°C" },
          { value: 100, label: "100°C" },
        ]}
        getAriaValuetext={(value) => `${value}°C`}
        getValueIndicatorLabel={({ value }) => `${value}°C`}
        getAriaLabel={() => "온도"}
      />
      <Slider
        min={0}
        max={100}
        defaultValues={[30]}
        markers={[0, 20, 40, 60, 80, 100]}
        getAriaLabel={() => "값"}
      />
    </VStack>
  );
}
