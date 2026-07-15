"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { MannerTemp } from "seed-design/ui/manner-temp";

export const story = defineStory({
  displayName: "MannerTemp",
  Component: withStoryPreview()(MannerTemp),
  args: {
    initial: {
      temperature: 36.5,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
