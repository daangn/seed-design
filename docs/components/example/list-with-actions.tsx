"use client";

import {
  IconCheckmarkFill,
  IconChevronRightLine,
  IconPlusFill,
} from "@karrotmarket/react-monochrome-icon";
import { Icon, List, PrefixIcon } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { ToggleButton } from "seed-design/ui/toggle-button";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function ListWithActions() {
  const [pressed, setPressed] = useState(false);

  return (
    <List.Root width="300px">
      <List.Item>
        <List.Content>
          <List.Title>알림</List.Title>
          <List.Detail>푸시 알림 및 소리 설정</List.Detail>
        </List.Content>
        <List.Suffix>
          <ActionButton size="xsmall" variant="neutralWeak" onClick={() => alert("편집 클릭됨")}>
            편집
          </ActionButton>
        </List.Suffix>
      </List.Item>
      <List.Item>
        <List.Prefix>
          <Avatar
            size="48"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            fallback={<IdentityPlaceholder />}
          />
        </List.Prefix>
        <List.Content asChild>
          <button type="button" onClick={() => alert("사용자 클릭됨")}>
            <List.Title>사용자</List.Title>
            <List.Detail>항목 6개</List.Detail>
          </button>
        </List.Content>
        <List.Suffix gap="x2">
          <ToggleButton
            size="xsmall"
            variant="brandSolid"
            pressed={pressed}
            onPressedChange={setPressed}
          >
            <PrefixIcon svg={pressed ? <IconCheckmarkFill /> : <IconPlusFill />} />
            {pressed ? "모아보는 중" : "모아보기"}
          </ToggleButton>
          <Icon svg={<IconChevronRightLine />} />
        </List.Suffix>
      </List.Item>
    </List.Root>
  );
}
