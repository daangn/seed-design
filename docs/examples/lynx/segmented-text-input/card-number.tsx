import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { CardNumberField } from "@/components/ui/card-number-field";

export default function Example() {
  return (
    <VStack className="segmented-text-input-preview" gap="spacingY.componentDefault">
      <CardNumberField label="카드번호" description="maskedDigits=8 (default)" />
      <CardNumberField
        label="카드번호"
        description="maskedDigits=4, suffix"
        maskedDigits={4}
        suffix={<CardLogo />}
      />
    </VStack>
  );
}

// 예시용 카드사 로고입니다. 실제 서비스에서는 카드사 로고 자산을 크기와 함께 넣습니다.
function CardLogo() {
  return (
    <view className="segmented-text-input-preview__card-logo" accessibility-label="카드사">
      <view className="segmented-text-input-preview__card-logo-chip" />
    </view>
  );
}
