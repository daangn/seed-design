import { FieldButton, FieldButtonPlaceholder, FieldButtonValue } from "seed-design/ui/field-button";
import { useState } from "react";

export default function FieldButtonBasicUsage() {
  const [selectedCity, setSelectedCity] = useState<string>("");

  return (
    <FieldButton
      label="도시"
      showClearButton={!!selectedCity}
      values={[selectedCity]}
      onValuesChange={([value]) => setSelectedCity(value)}
      buttonProps={{
        onClick: () => {
          // Open your picker dialog/sheet here
          setSelectedCity("서울");
        },
        "aria-label": selectedCity ? `도시 변경. 현재: ${selectedCity}` : "도시 선택",
      }}
    >
      {selectedCity ? (
        <FieldButtonValue>{selectedCity}</FieldButtonValue>
      ) : (
        <FieldButtonPlaceholder>도시를 선택해주세요</FieldButtonPlaceholder>
      )}
    </FieldButton>
  );
}
