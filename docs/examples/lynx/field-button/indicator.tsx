import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { FieldButton, FieldButtonPlaceholder } from "@/components/ui/field-button";

export default function Example() {
  return (
    <VStack className="field-button-preview__content" gap="spacingY.componentDefault">
      <FieldButton
        label="선택 필드"
        labelWeight="bold"
        indicator="선택"
        description="이 필드는 선택사항입니다."
        buttonProps={{ "accessibility-label": "선택 값 입력" }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="필수 필드"
        required
        showRequiredIndicator
        description="이 필드는 필수사항입니다."
        buttonProps={{ "accessibility-label": "필수 값 입력" }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </VStack>
  );
}
