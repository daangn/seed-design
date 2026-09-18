import "./styles";

import { useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Slider } from "@/components/ui/slider";

const DEFAULT_VALUE = [50];

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState(DEFAULT_VALUE);
  function handleValuesChange(nextValues: number[]) {
    "background only";
    setValue(nextValues);
  }

  function handleSetMin() {
    "background only";
    setValue([0]);
  }

  function handleReset() {
    "background only";
    setValue(DEFAULT_VALUE);
  }

  function handleSetMax() {
    "background only";
    setValue([100]);
  }

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
      <view className="slider-preview">
        <Slider
          min={0}
          max={100}
          values={value}
          onValuesChange={handleValuesChange}
          getAccessibilityLabel={() => "값"}
        />
        <text className="slider-preview__status">{JSON.stringify(value)}</text>
        <view className="slider-preview__actions">
          <view
            className="slider-preview__button"
            bindtap={handleSetMin}
            accessibility-label="Set Min"
          >
            <text>Set Min</text>
          </view>
          <view
            className="slider-preview__button"
            bindtap={handleReset}
            accessibility-label="Reset"
          >
            <text>Reset</text>
          </view>
          <view
            className="slider-preview__button"
            bindtap={handleSetMax}
            accessibility-label="Set Max"
          >
            <text>Set Max</text>
          </view>
        </view>
      </view>
    </view>
  );
}
