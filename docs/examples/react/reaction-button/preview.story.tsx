"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { IconFaceSmileCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Count, PrefixIcon } from "@seed-design/react";
import type { ComponentPropsWithoutRef } from "react";
import { ReactionButton } from "seed-design/ui/reaction-button";

// Controls come from ReactionButton's real props (pressed/size/loading/disabled);
// the icon, label, and count are fixed.
function ReactionButtonDemo(props: ComponentPropsWithoutRef<typeof ReactionButton>) {
  return (
    <ReactionButton {...props}>
      <PrefixIcon svg={<IconFaceSmileCircleFill />} />
      도움돼요
      <Count>1</Count>
    </ReactionButton>
  );
}

export const story = defineStory({
  // pressed is controlled state (keep defaultPressed instead)
  Component: withStoryPreview<{ children?: never; asChild?: never; pressed?: never }>()(
    ReactionButtonDemo,
  ),
  args: {},
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
