import { VStack } from "@seed-design/react";
import { Slider } from "seed-design/ui/slider";

export default function SliderField() {
  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Slider
        label="내일 날씨가 좋을 것 같다고 생각한다."
        required
        showRequiredIndicator
        min={0}
        max={1000}
        defaultValues={[500]}
        ticks={[200, 400, 600, 800]}
        markers={[
          { value: 200, label: "동의하지 않음" },
          { value: 400, label: "약간 동의하지 않음" },
          { value: 600, label: "약간 동의함" },
          { value: 800, label: "동의함" },
        ]}
        hideRange
        description="내일 날씨에 대한 당신의 기대감을 나타내 주세요."
      />
    </VStack>
  );
}
