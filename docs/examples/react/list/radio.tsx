import { RadioGroup } from "@seed-design/react";
import { List, ListDivider, ListRadioItem } from "@/registry/ui/list";
import { RadioMark } from "@/registry/ui/radio-group";

export default function ListRadio() {
  return (
    <List width="full" asChild>
      <RadioGroup.Root defaultValue="option1" aria-label="옵션 선택">
        <ListRadioItem
          value="option1"
          title="옵션 1"
          detail="첫 번째 선택지"
          suffix={<RadioMark size="large" />}
        />
        <ListDivider as="div" />
        <ListRadioItem
          prefix={<RadioMark size="large" />}
          value="option2"
          title="옵션 2"
          detail="두 번째 선택지"
        />
        <ListDivider as="div" />
        <ListRadioItem
          prefix={<RadioMark size="large" />}
          value="option3"
          title="옵션 3"
          detail="세 번째 선택지"
        />
      </RadioGroup.Root>
    </List>
  );
}
