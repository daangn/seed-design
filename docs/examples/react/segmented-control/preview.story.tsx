"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import type { ComponentPropsWithoutRef } from "react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

// Controls come from SegmentedControl's real group-level props; the segments are
// fixed representatives.
function SegmentedControlPreview(props: ComponentPropsWithoutRef<typeof SegmentedControl>) {
  return (
    <SegmentedControl {...props} defaultValue="hot" aria-label="정렬">
      <SegmentedControlItem value="hot">인기순</SegmentedControlItem>
      <SegmentedControlItem value="new" notification>
        최신순
      </SegmentedControlItem>
    </SegmentedControl>
  );
}

export const story = defineStory({
  // value/defaultValue are the controlled selection (a fixed one is hardcoded)
  Component: withStoryPreview<{
    children?: never;
    asChild?: never;
    value?: never;
    defaultValue?: never;
  }>()(SegmentedControlPreview),
  args: {},
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
