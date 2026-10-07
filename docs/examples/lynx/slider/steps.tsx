import "./styles";

import { useState } from "@lynx-js/react";

import { Slider } from "@/components/ui/slider";

export default function Example() {
  const [value, setValue] = useState([50]);

  function handleValuesChange(nextValues: number[]) {
    "background only";
    setValue(nextValues);
  }

  return (
    <view className="slider-preview">
      <Slider
        min={0}
        max={100}
        step={10}
        values={value}
        onValuesChange={handleValuesChange}
        getAccessibilityLabel={() => "값"}
      />
      <text className="slider-preview__status">{JSON.stringify(value)}</text>
    </view>
  );
}
