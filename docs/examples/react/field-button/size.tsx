import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";

export default function FieldButtonSize() {
  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="size=large (default)"
        size="large"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "선택 화면 열기",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="size=medium"
        size="medium"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "선택 화면 열기",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="size=responsive"
        size="responsive"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "선택 화면 열기",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
