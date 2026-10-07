import "./styles";

import { Slider } from "@/components/ui/slider";

export default function SliderHideValueIndicator() {
  return (
    <view className="slider-preview">
      <Slider
        min={0}
        max={100}
        defaultValues={[50]}
        hideValueIndicator
        getAccessibilityLabel={() => "값"}
      />
    </view>
  );
}
