"use client";

import { type OptionalLineIconName, resolveStoryIcon } from "@/components/story/icon-set";
import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import type { ComponentPropsWithoutRef } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

// Controls come from SwipeableMenuSheetRoot's real props plus a prefix-icon
// picker shared by every item; the trigger and item tree are otherwise fixed.
function SwipeableMenuSheetPreview({
  prefixIcon = "IconEyeSlashLine",
  ...props
}: ComponentPropsWithoutRef<typeof SwipeableMenuSheetRoot> & {
  prefixIcon?: OptionalLineIconName;
}) {
  const icon = resolveStoryIcon(prefixIcon);
  return (
    <SwipeableMenuSheetRoot {...props}>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent title="메뉴" description="항목을 선택하세요" aria-label="메뉴">
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem
            label="첫 번째 작업"
            description="항목에 대한 부가 설명을 배치할 수 있습니다."
            prefixIcon={icon}
          />
          <SwipeableMenuSheetItem label="두 번째 작업" prefixIcon={icon} />
          <SwipeableMenuSheetItem label="세 번째 작업" prefixIcon={icon} />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="삭제" prefixIcon={icon} tone="critical" />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
}

export const story = defineStory({
  Component: withStoryPreview<{ children?: never; open?: never; onOpenChange?: never }>()(
    SwipeableMenuSheetPreview,
  ),
  args: {
    initial: {
      prefixIcon: "IconEyeSlashLine",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
