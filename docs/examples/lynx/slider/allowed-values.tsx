import "./styles";

import { useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { Slider } from "@/components/ui/slider";

const ALLOWED_VALUES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [values, setValues] = useState([ALLOWED_VALUES[0], ALLOWED_VALUES[2]]);

  function handleValuesChange(nextValues: number[]) {
    "background only";
    setValues(nextValues);
  }

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
      <view className="slider-preview">
        <Slider
          min={0}
          max={30}
          values={values}
          onValuesChange={handleValuesChange}
          allowedValues={ALLOWED_VALUES}
          markers={ALLOWED_VALUES.map((value) => ({ label: value, value }))}
          getAccessibilityLabel={() => "값"}
        />
        <text className="slider-preview__status">{JSON.stringify(values)}</text>
      </view>
    </view>
  );
}
