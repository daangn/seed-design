import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";

export default function FieldButtonReadOnly() {
  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        readOnly
        buttonProps={{
          "aria-label": "값 선택",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        readOnly
        invalid
        errorMessage="오류가 발생한 이유를 써주세요"
        buttonProps={{
          "aria-label": "값 선택",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
