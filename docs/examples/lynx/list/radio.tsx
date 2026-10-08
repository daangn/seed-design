import "./styles";

import { RadioGroup } from "@seed-design/lynx-react-radio-group";

import { List, ListDivider, ListRadioItem } from "@/components/ui/list";
import { Radiomark } from "@/components/ui/radio-group";

export default function Example() {
  return (
    <RadioGroup.Root
      className="list-preview"
      defaultValue="option1"
      accessibility-label="옵션 선택"
    >
      <List>
        <ListRadioItem
          value="option1"
          title="옵션 1"
          detail="첫 번째 선택지"
          suffix={<Radiomark tone="neutral" size="large" />}
        />
        <ListDivider />
        <ListRadioItem
          value="option2"
          title="옵션 2"
          detail="두 번째 선택지"
          prefix={<Radiomark tone="neutral" size="large" />}
          suffix={null}
        />
        <ListDivider />
        <ListRadioItem
          value="option3"
          title="옵션 3"
          detail="세 번째 선택지"
          prefix={<Radiomark tone="neutral" size="large" />}
          suffix={null}
        />
      </List>
    </RadioGroup.Root>
  );
}
