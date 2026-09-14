import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { Slider } from "@/components/ui/slider";

export default function SliderDisabled() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
      <view className="slider-preview">
        <Slider
          min={0}
          max={100}
          defaultValues={[50]}
          disabled
          getAccessibilityLabel={() => "값"}
        />
        <Slider
          min={0}
          max={100}
          defaultValues={[25, 75]}
          disabled
          getAccessibilityLabel={(thumbIndex) => (thumbIndex === 0 ? "최소값" : "최대값")}
        />
      </view>
    </view>
  );
}
