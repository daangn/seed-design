import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderRtl() {
  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Slider
        dir="rtl"
        min={0}
        max={100}
        step={0.5}
        defaultValues={[36.5]}
        ticks={[36.5]}
        tickWeight="thick"
        markers={[
          { value: 0, label: "0°C" },
          { value: 36.5, label: "36.5°C" },
          { value: 100, label: "100°C" },
        ]}
        getAriaValuetext={(value) => `${value}°C`}
        getValueIndicatorLabel={({ value }) => `${value}°C`}
        getAriaLabel={() => "온도"}
      />
      <Slider
        dir="rtl"
        min={0}
        max={100}
        defaultValues={[30, 50]}
        ticks={[20, 40, 60, 80]}
        markers={[0, 20, 40, 60, 80, 100]}
        getAriaLabel={() => "값"}
      />
    </VStack>
  );
}
