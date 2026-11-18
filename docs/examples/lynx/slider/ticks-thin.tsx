import "./styles";

import { Slider } from "@/components/ui/slider";

export default function Example() {
  return (
    <view className="slider-preview">
      <Slider
        min={0}
        max={100}
        step={0.1}
        defaultValues={[50]}
        ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90]}
        tickWeight="thin"
        getAccessibilityLabel={() => "값"}
      />
    </view>
  );
}
