import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { Slider } from "@/components/ui/slider";

const markers = [
  { value: 0, label: "매우 동의하지 않음" },
  { value: 14, label: "매우 동의함" },
];

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-slider-root`}>
      <view className="slider-preview">
        <Slider
          label="내일 날씨가 좋을 것 같다고 생각한다."
          min={0}
          max={14}
          defaultValues={[7]}
          ticks={[2, 4, 6, 8, 10, 12]}
          markers={markers}
          hideRange
          description="내일 날씨에 대한 당신의 기대감을 0~14 사이 숫자로 나타내 주세요."
          getAccessibilityValueText={(value) =>
            `${value} ${markers.find((marker) => marker.value === value)?.label ?? ""}`.trim()
          }
        />
        <Slider
          label="Invalid Slider"
          labelWeight="bold"
          min={0}
          max={1000}
          defaultValues={[500]}
          invalid
          errorMessage="올바르지 않은 값입니다."
        />
      </view>
    </view>
  );
}
