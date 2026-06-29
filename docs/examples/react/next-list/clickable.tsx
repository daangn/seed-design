import {
  IconArrowUpRightLine,
  IconCheckmarkFill,
  IconChevronRightLine,
  IconPenHorizlineFill,
  IconPlusFill,
  IconSquare2StackedFill,
} from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon, Icon, Box } from "@seed-design/react";
import { useCallback, useState } from "react";
import { NextList, NextListDivider, NextListItem, NextListButtonItem, NextListLinkItem } from "seed-design/ui/next-list";
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
    <NextList width="full">
      <NextListItem
        title="NextListItem은 클릭할 수 없어요. 눌러보세요."
        detail="우측의 Action Button만 클릭할 수 있어요"
        suffix={
          <ActionButton
            variant="ghost"
            size="xsmall"
            color="fg.neutralMuted"
            onClick={() => alert("편집 클릭됨")}
          >
            <PrefixIcon svg={<IconPenHorizlineFill />} />
            편집
          </ActionButton>
        }
      />
      <NextListDivider />
      <NextListButtonItem
        title="NextListButtonItem은 클릭할 수 있어요. 눌러보세요."
        detail="리스트 항목 전체와 우측의 Toggle Button 각각을 클릭할 수 있어요"
        onClick={() => alert("리스트 아이템 클릭됨")}
        suffix={
          <>
            <ToggleButton size="xsmall" pressed={isSubscribed} onPressedChange={setIsSubscribed}>
              <PrefixIcon svg={isSubscribed ? <IconCheckmarkFill /> : <IconPlusFill />} />
              {isSubscribed ? "모아보는 중" : "모아보기"}
            </ToggleButton>
            <Icon svg={<IconChevronRightLine />} />
          </>
        }
      />
      <NextListDivider />
      <NextListButtonItem
        title="NextListButtonItem은 클릭할 수 있어요. 눌러보세요."
        detail="리스트 항목 전체와 우측의 커스텀 버튼 각각을 클릭할 수 있어요"
        onClick={() => alert("리스트 아이템 클릭됨")}
        suffix={
          <>
            <Box asChild bg="bg.brandSolid" color="palette.staticWhite" p="x1" borderRadius="r1_5">
              <button
                type="button"
                onClick={() => alert("커스텀 버튼 클릭됨")}
                style={{ zIndex: 1 }}
              >
                커스텀 버튼
              </button>
            </Box>
            <Icon svg={<IconChevronRightLine />} />
          </>
        }
      />
      <NextListDivider />
      <NextListLinkItem
        title="NextListLinkItem도 클릭할 수 있어요. 눌러보세요."
        detail="리스트 항목 전체와 우측의 Action Button 각각을 클릭할 수 있어요"
        suffix={
          <>
            <ActionButton variant="neutralWeak" size="xsmall" onClick={onCopyClick}>
              <PrefixIcon svg={isCopied ? <IconCheckmarkFill /> : <IconSquare2StackedFill />} />
              {isCopied ? "복사됨" : "URL 복사"}
            </ActionButton>
            <Icon svg={<IconArrowUpRightLine />} />
          </>
        }
        href={href}
        target="_blank"
        rel="noreferrer"
      />
    </NextList>
  );
}
