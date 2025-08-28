"use client";

import { IconChevronRightLine } from "@karrotmarket/react-monochrome-icon";
import { Divider, Icon } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { List, ListItem } from "seed-design/ui/list";
import { ToggleButton } from "seed-design/ui/toggle-button";

export default function ListAffixes() {
  const [isToggleButtonPressed, setIsToggleButtonPressed] = useState(false);

  return (
    <List width="full" py="x4">
      <ListItem
        prefix={
          <Avatar
            size="48"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            fallback={<IdentityPlaceholder />}
          />
        }
        title="사용자 이름"
        detail="온라인 상태"
      />
      <Divider as="div" />
      <ListItem
        prefix={<Avatar size="48" fallback={<IdentityPlaceholder />} />}
        title="익명 사용자"
        detail="오프라인"
      />
      <Divider as="div" />
      <ListItem
        title="ullamco"
        detail="Veniam non est non ut consequat."
        suffix={<ActionButton size="xsmall">액션 버튼</ActionButton>}
      />
      <Divider as="div" />
      <ListItem
        title="aliqua"
        detail="Sit eu incididunt aute ea elit ex."
        suffix={
          <ToggleButton
            size="xsmall"
            pressed={isToggleButtonPressed}
            onPressedChange={setIsToggleButtonPressed}
          >
            {isToggleButtonPressed ? "선택됨" : "토글 버튼"}
          </ToggleButton>
        }
      />
      <Divider as="div" />
      <ListItem
        title="occaecat"
        detail="Deserunt nulla elit est."
        suffix={<Icon svg={<IconChevronRightLine />} />}
      />
    </List>
  );
}
