"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

function SegmentedControlPreview({
  firstLabel,
  secondLabel,
  notification,
}: {
  firstLabel?: string;
  secondLabel?: string;
  notification?: boolean;
}) {
  return (
    <SegmentedControl defaultValue="Hot" aria-label="Sort by">
      <SegmentedControlItem value="Hot">{firstLabel}</SegmentedControlItem>
      <SegmentedControlItem value="New" notification={notification}>
        {secondLabel}
      </SegmentedControlItem>
    </SegmentedControl>
  );
}

export const story = defineStory({
  displayName: "SegmentedControl",
  Component: withStoryPreview()(SegmentedControlPreview),
  args: {
    initial: {
      firstLabel: "Hot",
      secondLabel: "New",
      notification: false,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
