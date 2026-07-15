"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { IconILowercaseSerifCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import type { ComponentPropsWithoutRef } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";

// Controls come from HelpBubbleTrigger's real props (title/description/placement/
// …); the wrapped trigger button is fixed. `isolation: isolate` creates a
// stacking context so the popover stacks correctly on the story canvas.
function HelpBubblePreview(props: ComponentPropsWithoutRef<typeof HelpBubbleTrigger>) {
  return (
    <div style={{ isolation: "isolate" }}>
      <HelpBubbleTrigger {...props}>
        <ActionButton variant="ghost" size="small" layout="iconOnly" aria-label="도움말">
          <Icon svg={<IconILowercaseSerifCircleFill />} />
        </ActionButton>
      </HelpBubbleTrigger>
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
  }>()(HelpBubblePreview),
  args: {
    initial: {
      title: "아래 버튼이나 바깥 영역을 클릭해서 닫아보세요.",
      defaultOpen: true,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
