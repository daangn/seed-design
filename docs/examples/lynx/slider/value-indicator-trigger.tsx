import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { Slider } from "@/components/ui/slider";

export default function SliderValueIndicatorTrigger() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
      <view className="slider-preview">
        <Slider
          label="auto (default)"
          min={0}
          max={100}
          defaultValues={[50]}
          valueIndicatorTrigger="auto"
          getAccessibilityLabel={() => "값"}
        />
        <Slider
          label="active"
          min={0}
          max={100}
          defaultValues={[50]}
          valueIndicatorTrigger="active"
          getAccessibilityLabel={() => "값"}
        />
        <text className="slider-preview__status">
          auto와 active 모두 터치로 활성화된 동안에만 값 표시
        </text>
      </view>
    </view>
  );
}
