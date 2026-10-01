import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { Slider } from "@/components/ui/slider";

// Lynx JS 런타임에는 `Intl`이 없으므로 천 단위 구분 기호를 직접 넣습니다.
function formatNumber(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function SliderCustomValueIndicatorLabel() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
      {/* 두 줄 Value Indicator가 예제 영역 위로 잘리지 않도록 위 여백을 더합니다. */}
      <view className="slider-preview" style={{ paddingTop: "32px" }}>
        <Slider
          min={0}
          max={1_000_000}
          defaultValues={[20_000, 500_000]}
          getValueIndicatorLabel={({ value, thumbIndex }) => (
            <text>{`thumb ${thumbIndex}\n${formatNumber(value)}`}</text>
          )}
          getAccessibilityValueText={formatNumber}
          getAccessibilityLabel={() => "값"}
        />
      </view>
    </view>
  );
}
