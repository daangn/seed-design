import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderBasic() {
  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Slider min={0} max={10} defaultValues={[5]} />
      <Slider min={0} max={1000} defaultValues={[600]} />
    </VStack>
  );
}
