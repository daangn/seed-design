import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderDisabled() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <Slider min={0} max={100} defaultValues={[50]} disabled />
      <Slider min={0} max={100} defaultValues={[25, 75]} disabled />
    </VStack>
  );
}
