import "./styles";

import { Slider } from "@/components/ui/slider";
import { useSeedClassName } from "@seed-design/lynx-react";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
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
    </view>
  );
}
