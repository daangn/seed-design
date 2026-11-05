import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { FieldButton, FieldButtonPlaceholder } from "@/components/ui/field-button";

export default function Example() {
  function handleTap() {
    "background only";
  }

  return (
    <VStack className="field-button-preview__content" gap="spacingY.componentDefault">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        disabled
        showClearButton
        buttonProps={{ bindtap: handleTap, "accessibility-label": "값 선택" }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        disabled
        invalid
        errorMessage="오류가 발생한 이유를 써주세요"
        buttonProps={{ bindtap: handleTap, "accessibility-label": "값 선택" }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </VStack>
  );
}
