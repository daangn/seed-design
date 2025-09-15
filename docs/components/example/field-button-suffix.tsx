import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";
import { IconWonLine } from "@karrotmarket/react-monochrome-icon";

export default function FieldButtonSuffix() {
  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        suffix="cm"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "키 입력",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        suffixIcon={<IconWonLine />}
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "금액 입력",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
