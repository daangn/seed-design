"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import type { ComponentPropsWithoutRef } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

// Controls come from BottomSheetRoot's real props; the trigger and content tree
// are fixed.
function BottomSheetPreview(props: ComponentPropsWithoutRef<typeof BottomSheetRoot>) {
  return (
    <BottomSheetRoot {...props}>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">바텀시트 열기</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="제목" description="설명을 작성할 수 있어요">
        <BottomSheetBody>바텀시트 본문 내용이 들어가는 영역입니다.</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
}

export const story = defineStory({
  // container is object plumbing; activeSnapPoint is controlled state (needs a
  // handler) — neither is a usable control widget
  Component: withStoryPreview<{
    children?: never;
    open?: never;
    onOpenChange?: never;
    container?: never;
    activeSnapPoint?: never;
  }>()(BottomSheetPreview),
  args: {},
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
