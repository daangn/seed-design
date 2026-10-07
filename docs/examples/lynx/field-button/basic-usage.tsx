import "./styles";

import { useState } from "@lynx-js/react";
import { VStack } from "@seed-design/lynx-react";
import {
  FieldButton,
  FieldButtonPlaceholder,
  FieldButtonValue,
} from "@/components/ui/field-button";

export default function Example() {
  const [selectedCity, setSelectedCity] = useState("");

  function selectCity() {
    "background only";
    setSelectedCity("서울");
  }

  function changeCities([nextCity = ""]: string[]) {
    "background only";
    setSelectedCity(nextCity);
  }

  return (
    <VStack className="field-button-preview__content">
      <FieldButton
        label="도시"
        values={selectedCity ? [selectedCity] : []}
        onValuesChange={changeCities}
        showClearButton={selectedCity !== ""}
        buttonProps={{
          bindtap: selectCity,
          "accessibility-label": selectedCity ? `도시 변경. 현재: ${selectedCity}` : "도시 선택",
        }}
      >
        {selectedCity ? (
          <FieldButtonValue>{selectedCity}</FieldButtonValue>
        ) : (
          <FieldButtonPlaceholder>도시를 선택해주세요</FieldButtonPlaceholder>
        )}
      </FieldButton>
    </VStack>
  );
}
