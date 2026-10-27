import { VStack } from "@seed-design/react";
import { CardNumberField } from "seed-design/ui/card-number-field";

export default function SegmentedTextInputCardNumber() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
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
    <svg width="30" height="20" viewBox="0 0 30 20" role="img" aria-label="카드사">
      <rect width="30" height="20" rx="4" fill="#00a05b" />
      <rect x="5" y="7" width="8" height="6" rx="1.5" fill="#ffffff" fillOpacity="0.85" />
    </svg>
  );
}
