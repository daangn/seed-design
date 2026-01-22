import { IconTrashcanLine } from "@karrotmarket/react-monochrome-icon";
import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Icon } from "@seed-design/react";
import { List, ListDivider, ListSwitchItem } from "seed-design/ui/list";
import { Switchmark } from "seed-design/ui/switch";

export default function ListSwitch() {
  return (
    <List width="360px">
      <ListSwitchItem
        title="삭제하기 전에 확인"
        prefix={<Icon svg={<IconTrashcanLine />} />}
        suffix={<Switchmark tone="neutral" />}
      />
      <ListDivider />
      <ListSwitchItem
        title="메시지 요약"
        detail="핵심 내용만 빠르게 확인해보세요."
        prefix={<Icon svg={<IconSparkle2 />} />}
        suffix={<Switchmark tone="neutral" />}
        defaultChecked
      />
    </List>
  );
}
