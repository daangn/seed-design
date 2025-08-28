"use client";

import {
  IconArrowUpRightLine,
  IconCheckmarkFill,
  IconChevronRightLine,
  IconPlusFill,
  IconSquare2StackedFill,
} from "@karrotmarket/react-monochrome-icon";
import { Divider, HStack, PrefixIcon, Icon } from "@seed-design/react";
import { useCallback, useState } from "react";
import { List, ListItem, ListItemButton, ListItemAnchor } from "seed-design/ui/list";
import { ActionButton } from "seed-design/ui/action-button";
import { ToggleButton } from "seed-design/ui/toggle-button";

const href = "https://www.daangn.com";

export default function ListClickable() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const onCopyClick = useCallback(() => {
    navigator.clipboard.writeText(href);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  }, []);

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
            <ToggleButton size="xsmall" pressed={isSubscribed} onPressedChange={setIsSubscribed}>
              <PrefixIcon svg={isSubscribed ? <IconCheckmarkFill /> : <IconPlusFill />} />
              {isSubscribed ? "모아보는 중" : "모아보기"}
            </ToggleButton>
            <Icon svg={<IconChevronRightLine />} />
          </HStack>
        }
      />
      <Divider as="div" />
      <ListItemAnchor
        title="ListItemAnchor도 클릭할 수 있어요. 눌러보세요."
        detail="리스트 항목 전체와 우측의 Action Button 모두 클릭할 수 있어요"
        suffix={
          <HStack gap="x2" align="center">
            <ActionButton size="xsmall" onClick={onCopyClick}>
              <PrefixIcon svg={isCopied ? <IconCheckmarkFill /> : <IconSquare2StackedFill />} />
              {isCopied ? "복사됨" : "URL 복사"}
            </ActionButton>
            <Icon svg={<IconArrowUpRightLine />} />
          </HStack>
        }
        href={href}
        target="_blank"
        rel="noreferrer"
      />
    </List>
  );
}
