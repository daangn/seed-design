import { RadioGroup } from "@seed-design/react";
import { List, ListItemCheckbox, ListItemRadio } from "seed-design/ui/list";

export default function ListInteractive() {
  return (
    <List width="300px">
      {/* Checkbox Examples */}
      <ListItemCheckbox
        title="알림 수신 동의"
        detail="푸시 알림을 받으시겠습니까?"
      />

      <ListItemCheckbox
        title="마케팅 정보 수신 동의"
        defaultChecked
      />

      {/* Radio Group Example */}
      <RadioGroup.Root defaultValue="option1">
        <ListItemRadio
          value="option1"
          title="옵션 1"
          detail="첫 번째 선택지"
        />

        <ListItemRadio
          value="option2"
          title="옵션 2"
          detail="두 번째 선택지"
        />
      </RadioGroup.Root>
    </List>
  );
}
