import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { Slider } from "@/components/ui/slider";

const formatter = new Intl.NumberFormat("ko-KR", { style: "decimal" });

export default function SliderCustomValueIndicatorLabel() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
      <view className="slider-preview">
        <Slider
          min={0}
          max={1_000_000}
          defaultValues={[20_000, 500_000]}
          getValueIndicatorLabel={({ value, thumbIndex }) => (
            <text>{`thumb ${thumbIndex}\n${formatter.format(value)}`}</text>
          )}
          getAccessibilityValueText={formatter.format}
          getAccessibilityLabel={() => "값"}
        />
      </view>
    </view>
  );
}
