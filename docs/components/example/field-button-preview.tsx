"use client";

import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";

export default function FieldButtonPreview() {
  return (
    <FieldButton
      label="시작 날짜"
      description="이 이벤트의 시작 날짜를 선택해 주세요"
      onButtonClick={() => window.alert("버튼을 클릭했어요")}
    >
      <FieldButtonValue placeholder="2025-01-01" />
    </FieldButton>
  );
}
