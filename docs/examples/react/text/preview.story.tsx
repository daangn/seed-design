"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Text } from "@seed-design/react";

export const story = defineStory({
  displayName: "Text",
  Component: withStoryPreview()(Text),
  args: {
    initial: {
      textStyle: "t4Regular",
      color: "fg.neutral",
      children: "당근에서 이웃과 함께해요",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
