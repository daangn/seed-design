"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";

function BottomSheetPreview({
  triggerLabel,
  title,
  description,
  body,
  footerLabel,
}: {
  triggerLabel: string;
  title: string;
  description: string;
  body: string;
  footerLabel: string;
}) {
  return (
    <BottomSheetRoot>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">{triggerLabel}</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title={title} description={description}>
        <BottomSheetBody>{body}</BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton variant="neutralSolid">{footerLabel}</ActionButton>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
}

export const story = defineStory({
  displayName: "BottomSheet",
  Component: withStoryPreview()(BottomSheetPreview),
  args: {
    initial: {
      triggerLabel: "Open",
      title: "제목",
      description: "설명을 작성할 수 있어요",
      body: "Content",
      footerLabel: "확인",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
