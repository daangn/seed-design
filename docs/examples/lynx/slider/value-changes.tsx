import "./styles";

import { useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Slider } from "@/components/ui/slider";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState([20]);
  const [committedValue, setCommittedValue] = useState([20]);

  function handleValuesChange(nextValues: number[]) {
    "background only";
    setValue(nextValues);
  }

  function handleValuesCommit(nextValues: number[]) {
    "background only";
    setCommittedValue(nextValues);
  }

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
      <view className="slider-preview">
        <Slider
          min={0}
          max={100}
          values={value}
          onValuesChange={handleValuesChange}
          onValuesCommit={handleValuesCommit}
          getAccessibilityLabel={() => "값"}
        />
        <view className="slider-preview__status">
          <text>Current value: {JSON.stringify(value)}</text>
          <text>Committed value: {JSON.stringify(committedValue)}</text>
        </view>
      </view>
    </view>
  );
}
