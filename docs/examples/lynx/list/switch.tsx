import "./styles";

import IconTrashcanLine from "@karrotmarket/lynx-monochrome-icon/IconTrashcanLine";

import { PrefixIcon } from "@seed-design/lynx-react";

import { List, ListDivider, ListSwitchItem } from "@/components/ui/list";

export default function Example() {
  return (
    <List className="list-preview">
      <ListSwitchItem
        title="삭제하기 전에 확인"
        prefix={<PrefixIcon icon={<IconTrashcanLine />} />}
      />
      <ListDivider />
      <ListSwitchItem
        title="메시지 요약"
        detail="핵심 내용만 빠르게 확인해보세요."
        defaultChecked
      />
    </List>
  );
}
