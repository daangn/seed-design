"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Badge } from "@seed-design/react";

export const story = defineStory({
  displayName: "Badge",
  Component: withStoryPreview()(Badge),
  args: {
    initial: {
      tone: "neutral",
      children: "라벨",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
