"use client";

import { IconLocationpinFill } from "@karrotmarket/react-monochrome-icon";
import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { TagGroupItem, TagGroupRoot, type TagGroupRootProps } from "seed-design/ui/tag-group";

function TagGroupPreview({
  size,
  weight,
  tone,
}: {
  size?: TagGroupRootProps["size"];
  weight?: TagGroupRootProps["weight"];
  tone?: TagGroupRootProps["tone"];
}) {
  return (
    <TagGroupRoot size={size} weight={weight} tone={tone}>
      <TagGroupItem prefixIcon={<IconLocationpinFill />} label="500m" />
      <TagGroupItem label="서초4동" />
      <TagGroupItem label="3분 전" />
    </TagGroupRoot>
  );
}

export const story = defineStory({
  displayName: "TagGroup",
  Component: withStoryPreview()(TagGroupPreview),
  args: {
    initial: {
      size: "t2",
      weight: "regular",
      tone: "neutralSubtle",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
