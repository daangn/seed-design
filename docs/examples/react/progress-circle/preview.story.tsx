"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { ProgressCircle } from "seed-design/ui/progress-circle";

export const story = defineStory({
  displayName: "ProgressCircle",
  // ProgressCircle types `children` (inherited HTML attrs on the primitive Root)
  // but never renders it — Root's fixed <Track/><Range/> override any passed
  // children, so a `children` control would be dead. `children?: never` drops it.
  // The correct fix is upstream: omit `children` from ProgressCircleProps so the
  // type stops advertising a slot the component doesn't have.
  Component: withStoryPreview<{ children?: never }>()(ProgressCircle),
  args: {
    initial: {
      tone: "neutral",
      size: "40",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
