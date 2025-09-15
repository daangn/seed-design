"use client";

import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonValue, FieldButtonPlaceholder } from "seed-design/ui/field-button";
import { useCallback, useState } from "react";

export default function FieldButtonValuePlaceholder() {
  const [value, setValue] = useState<string>("");

  const toggleValue = useCallback(() => {
    setValue((prev) => (prev ? "" : "값 설정됨"));
  }, []);

  return (
    <HStack width="full" gap="x3">
      <FieldButton
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "알림 표시",
        }}
      >
        <FieldButtonValue>FieldButtonValue</FieldButtonValue>
      </FieldButton>
      <FieldButton
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "알림 표시",
        }}
      >
        <FieldButtonPlaceholder>FieldButtonPlaceholder</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        buttonProps={{
          onClick: toggleValue,
          "aria-label": "값 설정",
        }}
      >
        {value ? (
          <FieldButtonValue>{value}</FieldButtonValue>
        ) : (
          <FieldButtonPlaceholder>클릭하여 값 설정</FieldButtonPlaceholder>
        )}
      </FieldButton>
    </HStack>
  );
}
