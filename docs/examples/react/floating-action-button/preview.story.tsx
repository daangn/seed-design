"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import IconPlusLine from "@karrotmarket/react-monochrome-icon/IconPlusLine";
import {
  FloatingActionButton,
  type FloatingActionButtonProps,
} from "seed-design/ui/floating-action-button";

function FloatingActionButtonDemo({
  label,
  ...props
}: Pick<FloatingActionButtonProps, "extended"> & { label?: string }) {
  return <FloatingActionButton icon={<IconPlusLine />} label={label} {...props} />;
}

export const story = defineStory({
  displayName: "FloatingActionButton",
  Component: withStoryPreview()(FloatingActionButtonDemo),
  args: {
    initial: {
      label: "Example FAB",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
