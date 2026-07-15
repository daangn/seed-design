"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { IconQuestionmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";

function HelpBubbleTooltipPreview({ title, defaultOpen }: { title: string; defaultOpen: boolean }) {
  return (
    <div style={{ isolation: "isolate" }}>
      <HelpBubbleTooltipTrigger title={title} defaultOpen={defaultOpen}>
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
          <Icon svg={<IconQuestionmarkCircleFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
    </div>
  );
}

export const story = defineStory({
  displayName: "HelpBubbleTooltip",
  Component: withStoryPreview()(HelpBubbleTooltipPreview),
  args: {
    initial: {
      title: "포인터를 올리거나 키보드로 포커스하면 열립니다.",
      defaultOpen: false,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
