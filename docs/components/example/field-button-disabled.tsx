import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";

export default function FieldButtonDisabled() {
  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        disabled
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "값 선택",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        disabled
        invalid
        errorMessage="오류가 발생한 이유를 써주세요"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "값 선택",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
