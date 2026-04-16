import { FieldButton, FieldButtonPlaceholder, FieldButtonValue } from "seed-design/ui/field-button";
import { MenuAnchor, MenuContent, MenuGroup, MenuItem, MenuRoot } from "seed-design/ui/menu";
import { useState } from "react";

const fruits = ["사과", "바나나", "포도", "딸기", "수박"];

export default function MenuWithFieldButton() {
  const [selectedFruit, setSelectedFruit] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <MenuRoot open={open} onOpenChange={setOpen} matchReferenceWidth>
      <MenuAnchor asChild>
        <FieldButton
          label="과일"
          description="사과, 바나나, 포도, 딸기, 수박 중에서 선택할 수 있습니다."
          values={selectedFruit ? [selectedFruit] : undefined}
          showClearButton={!!selectedFruit}
          onValuesChange={([value]) => setSelectedFruit(value)}
          buttonProps={{
            onClick: () => setOpen((prev) => !prev),
            "aria-haspopup": "menu",
            "aria-expanded": open,
            "aria-label": selectedFruit ? `과일 변경. 현재: ${selectedFruit}` : "과일 선택",
          }}
        >
          {selectedFruit ? (
            <FieldButtonValue>{selectedFruit}</FieldButtonValue>
          ) : (
            <FieldButtonPlaceholder>과일을 선택해주세요</FieldButtonPlaceholder>
          )}
        </FieldButton>
      </MenuAnchor>
      <MenuContent>
        <MenuGroup>
          {fruits.map((fruit) => (
            <MenuItem key={fruit} label={fruit} onClick={() => setSelectedFruit(fruit)} />
          ))}
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}
