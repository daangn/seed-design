import {
  IconArrowUpBracketDownLine,
  IconILowercaseSerifCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { List, ListDivider, ListItem } from "seed-design/ui/list";
import { ToggleButton } from "seed-design/ui/toggle-button";

export default function ListAffixes() {
  const [isToggleButtonPressed, setIsToggleButtonPressed] = useState(false);

  return (
    <List width="360px">
      <ListItem
        prefix={
          <Avatar
            size="48"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            fallback={<IdentityPlaceholder />}
          />
        }
        title="Prefix에 Avatar 넣기"
        detail="Amet elit ullamco magna."
      />
      <ListDivider />
      <ListItem
        title="Prefix에 아이콘 넣기"
        detail="Deserunt nulla elit est."
        prefix={<Icon svg={<IconILowercaseSerifCircleLine />} />}
      />
      <ListDivider />
      <ListItem
        title="Suffix에 Action Button 넣기"
        detail="Veniam non est non ut consequat."
        suffix={
          <ActionButton variant="neutralWeak" size="xsmall">
            액션 버튼
          </ActionButton>
        }
      />
      <ListDivider />
      <ListItem
        title="Suffix에 Action Button (Ghost) 넣기"
        detail="Deserunt nulla elit est."
        suffix={
          <ActionButton size="small" variant="ghost" layout="iconOnly" aria-label="공유">
            <Icon svg={<IconArrowUpBracketDownLine />} />
          </ActionButton>
        }
      />
      <ListDivider />
      <ListItem
        title="Suffix에 Toggle Button 넣기"
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
    </List>
  );
}
