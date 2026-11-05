# @seed-design/lynx-react-slider

Headless component built to implement [SEED Lynx Slider](https://seed-design.io/lynx/components/slider). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { Slider } from "@seed-design/lynx-react-slider";

export function VolumeSlider() {
  const [values, setValues] = useState([50]);

  return (
    <Slider.Root
      values={values}
      onValuesChange={setValues}
      min={0}
      max={100}
      getAccessibilityLabel={() => "Volume"}
    >
      <Slider.Range />
      <Slider.Thumb thumbIndex={0}>
        <text>{values[0]}</text>
      </Slider.Thumb>
    </Slider.Root>
  );
}
```
