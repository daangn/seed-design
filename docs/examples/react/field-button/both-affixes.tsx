import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";
import { IconPlusCircleLine, IconWonLine } from "@karrotmarket/react-monochrome-icon";

export default function FieldButtonBothAffixes() {
  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        prefix="만"
        suffix="세"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "나이 선택",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        prefixIcon={<IconPlusCircleLine />}
        suffixIcon={<IconWonLine />}
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "금액 선택",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
