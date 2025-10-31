import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderDisabled() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <Slider min={0} max={100} defaultValues={[50]} disabled getAriaLabel={() => "값"} />
      <Slider
        min={0}
        max={100}
        defaultValues={[25, 75]}
        disabled
        getAriaLabel={(thumbIndex) => (thumbIndex === 0 ? "최소값" : "최대값")}
      />
    </VStack>
  );
}
