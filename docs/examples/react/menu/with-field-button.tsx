import { FieldButton, FieldButtonPlaceholder, FieldButtonValue } from "seed-design/ui/field-button";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "seed-design/ui/menu";
import { useState } from "react";

const cities = ["서울", "부산", "대구", "인천", "광주"];

const MenuWithFieldButton = () => {
  const [selectedCity, setSelectedCity] = useState("");

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <FieldButton
          label="도시"
          values={selectedCity ? [selectedCity] : undefined}
          showClearButton={!!selectedCity}
          onValuesChange={([value]) => setSelectedCity(value)}
          buttonProps={{
            "aria-label": selectedCity ? `도시 변경. 현재: ${selectedCity}` : "도시 선택",
          }}
        >
          {selectedCity ? (
            <FieldButtonValue>{selectedCity}</FieldButtonValue>
          ) : (
            <FieldButtonPlaceholder>도시를 선택해주세요</FieldButtonPlaceholder>
          )}
        </FieldButton>
      </MenuTrigger>
      <MenuContent>
        {cities.map((city) => (
          <MenuItem key={city} label={city} onClick={() => setSelectedCity(city)} />
        ))}
      </MenuContent>
    </MenuRoot>
  );
};

export default MenuWithFieldButton;
