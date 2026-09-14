import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { Slider } from "@/components/ui/slider";

export default function SliderHideValueIndicator() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
      <view className="slider-preview">
        <Slider
          min={0}
          max={100}
          defaultValues={[50]}
          hideValueIndicator
          getAccessibilityLabel={() => "값"}
        />
      </view>
    </view>
  );
}
