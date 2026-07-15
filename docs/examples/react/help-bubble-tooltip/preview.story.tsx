"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { IconQuestionmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import type { ComponentPropsWithoutRef } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";

// Controls come from HelpBubbleTooltipTrigger's real props; the wrapped trigger
// button is fixed. `isolation: isolate` creates a stacking context so the
// tooltip stacks correctly on the story canvas.
function HelpBubbleTooltipPreview(
  props: ComponentPropsWithoutRef<typeof HelpBubbleTooltipTrigger>,
) {
  return (
    <div style={{ isolation: "isolate" }}>
      <HelpBubbleTooltipTrigger {...props}>
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
          <Icon svg={<IconQuestionmarkCircleFill />} />
        </ActionButton>
      </HelpBubbleTooltipTrigger>
    </div>
  );
}

export const story = defineStory({
  // contentProps is object plumbing, not a usable control widget
  Component: withStoryPreview<{
    children?: never;
    open?: never;
    onOpenChange?: never;
    contentProps?: never;
  }>()(HelpBubbleTooltipPreview),
  args: {
    initial: {
      title: "포인터를 올리거나 키보드로 포커스하면 열립니다.",
      defaultOpen: false,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
