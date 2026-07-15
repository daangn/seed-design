"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { IconILowercaseSerifCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";

function HelpBubblePreview({ title, defaultOpen }: { title: string; defaultOpen?: boolean }) {
  // The original ComponentExample used `isolate` to create a new stacking
  // context so the popover stacks correctly. withStoryPreview's canvas does
  // not isolate, so restore it here.
  return (
    <div style={{ isolation: "isolate" }}>
      <HelpBubbleTrigger defaultOpen={defaultOpen} title={title}>
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
          <Icon svg={<IconILowercaseSerifCircleFill />} />
        </ActionButton>
      </HelpBubbleTrigger>
    </div>
  );
}

export const story = defineStory({
  displayName: "HelpBubble",
  Component: withStoryPreview()(HelpBubblePreview),
  args: {
    initial: {
      title: "아래 버튼이나 바깥 영역을 클릭해서 닫아보세요.",
      defaultOpen: true,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
