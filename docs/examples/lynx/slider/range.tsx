import "./styles";

import { Slider } from "@/components/ui/slider";
import { useState } from "@lynx-js/react";

export default function Example() {
  const [priceRange, setPriceRange] = useState([20, 80]);

  return (
    <view className="slider-preview">
      <Slider
        min={0}
        max={100}
        values={priceRange}
        onValuesChange={setPriceRange}
        getAccessibilityLabel={(thumbIndex) => (thumbIndex === 0 ? "최소값" : "최대값")}
      />
    </view>
  );
}
