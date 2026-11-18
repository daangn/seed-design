import "./styles";

import { Slider } from "@/components/ui/slider";

export default function Example() {
  return (
    <view className="slider-preview">
      <Slider
        min={0}
        max={100}
        defaultValues={[50]}
        markers={[
          { value: 0, label: "0°C" },
          { value: 25, label: "25°C" },
          { value: 50, label: "50°C" },
          { value: 75, label: "75°C" },
          { value: 100, label: "100°C" },
        ]}
        getAccessibilityValueText={(value) => `${value}°C`}
        getValueIndicatorLabel={({ value }) => `${value}°C`}
        getAccessibilityLabel={() => "온도"}
      />
      <Slider
        min={0}
        max={100}
        defaultValues={[30]}
        markers={[0, 20, 40, 60, 80, 100]}
        getAccessibilityLabel={() => "값"}
      />
    </view>
  );
}
