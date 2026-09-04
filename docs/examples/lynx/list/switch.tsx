import "./styles";

import IconTrashcanLine from "@karrotmarket/lynx-monochrome-icon/IconTrashcanLine";
import { root } from "@lynx-js/react";
import { PrefixIcon, useSeedClassName } from "@seed-design/lynx-react";

import { List, ListDivider, ListSwitchItem } from "@/components/ui/list";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="list-preview list-preview--centered">
        <List>
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
      </view>
    </page>
  );
}

root.render(<Root />);
