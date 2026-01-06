import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";

export default function FieldButtonIndicator() {
  return (
    <HStack gap="x3" width="full">
      <FieldButton
        label="선택 필드"
        labelWeight="bold"
        indicator="선택"
        description="이 필드는 선택사항입니다"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "선택 값 입력",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="필수 필드"
        showRequiredIndicator
        description="이 필드는 필수사항입니다"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "필수 값 입력",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
