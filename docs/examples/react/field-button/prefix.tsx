import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";
import { IconMagnifyingglassLine } from "@karrotmarket/react-monochrome-icon";

export default function FieldButtonPrefix() {
  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        prefix="https://"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "URL 입력",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        prefixIcon={<IconMagnifyingglassLine />}
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "검색",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
