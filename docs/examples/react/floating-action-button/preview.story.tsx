"use client";

import { type LineIconName, lineIconSet } from "@/components/story/icon-set";
import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import {
  FloatingActionButton,
  type FloatingActionButtonProps,
} from "seed-design/ui/floating-action-button";

function FloatingActionButtonDemo({
  label,
  icon = "IconPlusLine",
  ...props
}: Pick<FloatingActionButtonProps, "extended"> & { label?: string; icon?: LineIconName }) {
  return <FloatingActionButton icon={lineIconSet[icon]} label={label} {...props} />;
}

export const story = defineStory({
  Component: withStoryPreview()(FloatingActionButtonDemo),
  args: {
    initial: {
      label: "Example FAB",
      icon: "IconPlusLine",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
