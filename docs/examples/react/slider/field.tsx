import { Divider, VStack } from "@seed-design/react";
import { useState } from "react";
import { Slider } from "seed-design/ui/slider";

const markers = [
  { value: 2, label: "매우 동의하지 않음" },
  { value: 4, label: "동의하지 않음" },
  { value: 6, label: "약간 동의하지 않음" },
  { value: 8, label: "약간 동의함" },
  { value: 10, label: "동의함" },
  { value: 12, label: "매우 동의함" },
];

export default function SliderField() {
  const [isInvalid, setIsInvalid] = useState(false);

  return (
    <VStack gap="x8" width="full">
      <Slider
        label="내일 날씨가 좋을 것 같다고 생각한다."
        required
        showRequiredIndicator
        min={0}
        max={14}
        defaultValues={[500]}
        ticks={[2, 6, 8, 10, 12]}
        markers={markers}
        hideRange
        description="내일 날씨에 대한 당신의 기대감을 나타내 주세요."
        getAriaValuetext={(value) =>
          `${value} ${markers.find((marker) => marker.value === value)?.label ?? ""}`.trim()
        }
      />
      <Divider />
      <Slider
        label="슬라이더를 우측으로 이동하면 invalid 상태가 됩니다."
        invalid={isInvalid}
        min={0}
        max={1000}
        defaultValues={[500]}
        onValuesCommit={([value]) => setIsInvalid(value > 600)}
        description="슬라이더에 관한 적절한 설명을 작성해주세요."
        errorMessage="값이 너무 큽니다."
      />
    </VStack>
  );
}
