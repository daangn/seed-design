import { RadioGroup } from "@seed-design/react/primitive";
import { List, ListDivider, ListRadioItem } from "seed-design/ui/list";
import { Radiomark } from "seed-design/ui/radio-group";

export default function ListRadio() {
  return (
    <List width="360px" asChild>
      <RadioGroup.Root defaultValue="option1" aria-label="옵션 선택">
        <ListRadioItem
          value="option1"
          title="옵션 1"
          detail="첫 번째 선택지"
          suffix={<Radiomark tone="neutral" size="large" />}
        />
        <ListDivider as="div" />
        <ListRadioItem
          prefix={<Radiomark tone="neutral" size="large" />}
          value="option2"
          title="옵션 2"
          detail="두 번째 선택지"
        />
        <ListDivider as="div" />
        <ListRadioItem
          prefix={<Radiomark tone="neutral" size="large" />}
          value="option3"
          title="옵션 3"
          detail="세 번째 선택지"
        />
      </RadioGroup.Root>
    </List>
  );
}
