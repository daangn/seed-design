import { RadioGroup } from "@seed-design/react";
import { List, ListDivider, ListItemRadio } from "seed-design/ui/list";

export default function ListRadio() {
  return (
    <List as="fieldset" width="full" asChild>
      <RadioGroup.Root defaultValue="option1" aria-label="옵션 선택">
        <ListItemRadio value="option1" title="옵션 1" detail="첫 번째 선택지" />
        <ListDivider as="div" />
        <ListItemRadio position="prefix" value="option2" title="옵션 2" detail="두 번째 선택지" />
        <ListDivider as="div" />
        <ListItemRadio position="prefix" value="option3" title="옵션 3" detail="세 번째 선택지" />
      </RadioGroup.Root>
    </List>
  );
}
