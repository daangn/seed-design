"use client";

import { type OptionalFillIconName, resolveStoryIcon } from "@/components/story/icon-set";
import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import type { ComponentPropsWithoutRef } from "react";
import { TagGroupItem, TagGroupRoot } from "seed-design/ui/tag-group";

// Controls come from TagGroupRoot's real group-level props (size/weight/tone)
// plus a prefix-icon picker for the first tag; the tags are fixed representatives.
function TagGroupPreview({
  prefixIcon = "IconLocationpinFill",
  ...props
}: ComponentPropsWithoutRef<typeof TagGroupRoot> & { prefixIcon?: OptionalFillIconName }) {
  return (
    <TagGroupRoot {...props}>
      <TagGroupItem prefixIcon={resolveStoryIcon(prefixIcon)} label="500m" />
      <TagGroupItem label="서초4동" />
      <TagGroupItem label="3분 전" />
    </TagGroupRoot>
  );
}

export const story = defineStory({
  Component: withStoryPreview<{ children?: never; asChild?: never }>()(TagGroupPreview),
  args: {
    initial: {
      size: "t2",
      weight: "regular",
      tone: "neutralSubtle",
      prefixIcon: "IconLocationpinFill",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
