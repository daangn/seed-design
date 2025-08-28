"use client";

import {
  IconCheckmarkFill,
  IconChevronRightLine,
  IconPlusFill,
} from "@karrotmarket/react-monochrome-icon";
import { Divider, HStack, PrefixIcon, Icon } from "@seed-design/react";
import { useState } from "react";
import { List, ListItem, ListItemButton } from "seed-design/ui/list";
import { ActionButton } from "seed-design/ui/action-button";
import { ToggleButton } from "seed-design/ui/toggle-button";

export default function ListClickable() {
  const [pressed, setPressed] = useState(false);

  return (
    <List width="full">
      <ListItem
        title="ListItem은 클릭할 수 없어요. 눌러보세요."
        detail="우측의 Action Button만 클릭할 수 있어요"
        suffix={
          <ActionButton size="xsmall" onClick={() => alert("편집 클릭됨")}>
            편집
          </ActionButton>
        }
      />
      <Divider as="div" />
      <ListItemButton
        title="ListItemButton은 클릭할 수 있어요. 눌러보세요."
        detail="리스트 항목 전체와 우측의 Toggle Button 모두 클릭할 수 있어요"
        onClick={() => alert("리스트 아이템 클릭됨")}
        suffix={
          <HStack gap="x2" align="center">
            <ToggleButton size="xsmall" pressed={pressed} onPressedChange={setPressed}>
              <PrefixIcon svg={pressed ? <IconCheckmarkFill /> : <IconPlusFill />} />
              {pressed ? "모아보는 중" : "모아보기"}
            </ToggleButton>
            <Icon svg={<IconChevronRightLine />} />
          </HStack>
        }
      />
    </List>
  );
}
