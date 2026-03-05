import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderValueIndicatorTrigger() {
  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Slider
        label="auto (default)"
        min={0}
        max={100}
        defaultValues={[50]}
        valueIndicatorTrigger="auto"
        getAriaLabel={() => "값"}
      />
      <Slider
        label="hover"
        min={0}
        max={100}
        defaultValues={[50]}
        valueIndicatorTrigger="hover"
        getAriaLabel={() => "값"}
      />
      <Slider
        label="active"
        min={0}
        max={100}
        defaultValues={[50]}
        valueIndicatorTrigger="active"
        getAriaLabel={() => "값"}
      />
    </VStack>
  );
}
