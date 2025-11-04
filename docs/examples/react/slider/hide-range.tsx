import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderHideRange() {
  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Slider min={0} max={100} defaultValues={[60]} hideRange getAriaLabel={() => "값"} />
      <Slider
        min={0}
        max={100}
        defaultValues={[20, 80]}
        hideRange
        getAriaLabel={(thumbIndex) => (thumbIndex === 0 ? "최소값" : "최대값")}
      />
    </VStack>
  );
}
