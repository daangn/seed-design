import { FieldButton } from "seed-design/ui/field-button";

export default function FieldButtonPreview() {
  return (
    <FieldButton
      label="레이블"
      description="버튼에 대한 설명을 작성해주세요"
      buttonProps={{
        onClick: () => window.alert("버튼 클릭됨"),
        "aria-label": "알림 표시",
      }}
    />
  );
}
