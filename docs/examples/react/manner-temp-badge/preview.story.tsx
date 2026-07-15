"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { MannerTempBadge } from "seed-design/ui/manner-temp-badge";

export const story = defineStory({
  Component: withStoryPreview()(MannerTempBadge),
  args: {
    initial: {
      temperature: 36.5,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
