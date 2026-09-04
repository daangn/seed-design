import "./styles";

import { root, useState } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import {
  FieldButton,
  FieldButtonPlaceholder,
  FieldButtonValue,
} from "@/components/ui/field-button";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [selectedCity, setSelectedCity] = useState("");

  function selectCity() {
    "background only";
    setSelectedCity("서울");
  }

  function clearCity() {
    "background only";
    setSelectedCity("");
  }

  return (
    <page className={seedClassName}>
      <VStack className="input-button-preview">
        <VStack className="input-button-preview__content">
          <FieldButton
            label="도시"
            showClearButton={selectedCity !== ""}
            buttonProps={{
              bindtap: selectCity,
              "accessibility-label": selectedCity
                ? `도시 변경. 현재: ${selectedCity}`
                : "도시 선택",
            }}
            clearButtonProps={{ bindtap: clearCity }}
          >
            {selectedCity ? (
              <FieldButtonValue>{selectedCity}</FieldButtonValue>
            ) : (
              <FieldButtonPlaceholder>도시를 선택해주세요</FieldButtonPlaceholder>
            )}
          </FieldButton>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
