import "./styles";

import { useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Slider } from "@/components/ui/slider";

const getAccessibilityLabel = (thumbIndex: number) => (thumbIndex === 0 ? "최소값" : "최대값");

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [values, setValues] = useState([10, 30]);

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
      <view className="slider-preview">
        <Slider
          min={0}
          max={100}
          values={values}
          onValuesChange={setValues}
          getAccessibilityLabel={getAccessibilityLabel}
        />
        <text className="slider-preview__status">values: {JSON.stringify(values)}</text>
        <text className="slider-preview__status">
          accessibility-label:{" "}
          {JSON.stringify(values.map((_, index) => getAccessibilityLabel(index)))}
        </text>
      </view>
    </view>
  );
}
