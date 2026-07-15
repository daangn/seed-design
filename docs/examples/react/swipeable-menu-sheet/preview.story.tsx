"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import type { ComponentPropsWithoutRef } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

// Controls come from SwipeableMenuSheetRoot's real props; the trigger and item
// tree are fixed.
function SwipeableMenuSheetPreview(props: ComponentPropsWithoutRef<typeof SwipeableMenuSheetRoot>) {
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
            prefixIcon={<IconEyeSlashLine />}
          />
          <SwipeableMenuSheetItem label="두 번째 작업" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem label="세 번째 작업" prefixIcon={<IconEyeSlashLine />} />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="삭제" prefixIcon={<IconEyeSlashLine />} tone="critical" />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
}

export const story = defineStory({
  Component: withStoryPreview<{ children?: never; open?: never; onOpenChange?: never }>()(
    SwipeableMenuSheetPreview,
  ),
  args: {},
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
