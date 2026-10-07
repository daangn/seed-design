import "./styles";

import { Slider } from "@/components/ui/slider";
import { useState } from "@lynx-js/react";

export default function Example() {
  const [values, setValues] = useState([20, 80]);

  return (
    <view className="slider-preview">
      <Slider
        min={0}
        max={100}
        values={values}
        onValuesChange={setValues}
        step={5}
        minStepsBetweenThumbs={6}
        getAccessibilityLabel={(thumbIndex) => (thumbIndex === 0 ? "최소값" : "최대값")}
      />
      <text>{JSON.stringify(values)}</text>
    </view>
  );
}
