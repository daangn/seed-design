"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Callout } from "seed-design/ui/callout";

export const story = defineStory({
  // prefixIcon is an icon slot; linkProps is object plumbing
  Component: withStoryPreview<{ prefixIcon?: never; linkProps?: never }>()(Callout),
  args: {
    initial: {
      tone: "neutral",
      description: "사용자가 알아야 할 정보를 강조해 보여주는 문구입니다.",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
