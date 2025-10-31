import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";
import { useState } from "react";

export default function SliderRange() {
  const [priceRange, setPriceRange] = useState([20, 80]);

  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Slider
        min={0}
        max={100}
        values={priceRange}
        onValuesChange={setPriceRange}
        getAriaLabel={(thumbIndex) => (thumbIndex === 0 ? "최소값" : "최대값")}
      />
    </VStack>
  );
}
