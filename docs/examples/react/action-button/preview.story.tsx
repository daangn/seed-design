"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { ActionButton } from "seed-design/ui/action-button";

export const story = defineStory({
  displayName: "ActionButton",
  Component: withStoryPreview()(ActionButton),
  args: {
    initial: {
      children: "라벨",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
