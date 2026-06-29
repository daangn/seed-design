import { IconTrashcanLine } from "@karrotmarket/react-monochrome-icon";
import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Icon } from "@seed-design/react";
import { NextList, NextListDivider, NextListSwitchItem } from "seed-design/ui/next-list";
import { Switchmark } from "seed-design/ui/switch";

export default function ListSwitch() {
  return (
    <NextList width="360px">
      <NextListSwitchItem
        title="삭제하기 전에 확인"
        prefix={<Icon svg={<IconTrashcanLine />} />}
        suffix={<Switchmark tone="neutral" />}
      />
      <NextListDivider />
      <NextListSwitchItem
        title="메시지 요약"
        detail="핵심 내용만 빠르게 확인해보세요."
        prefix={<Icon svg={<IconSparkle2 />} />}
        suffix={<Switchmark tone="neutral" />}
        defaultChecked
      />
    </NextList>
  );
}
