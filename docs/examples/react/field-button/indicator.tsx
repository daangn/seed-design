import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";

export default function FieldButtonIndicator() {
  return (
    <FieldButton
      label="선택사항"
      indicator="(옵션)"
      description="이 필드는 선택사항입니다"
      buttonProps={{
        onClick: () => window.alert("버튼 클릭됨"),
        "aria-label": "선택사항 값 입력",
      }}
    >
      <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
    </FieldButton>
  );
}
