"use client";

import * as React from "react";
import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import {
  ChipTabsList,
  ChipTabsRoot,
  type ChipTabsRootProps,
  ChipTabsTrigger,
} from "seed-design/ui/chip-tabs";

function ChipTabsPreview({
  variant,
  size,
}: {
  variant?: ChipTabsRootProps["variant"];
  size?: ChipTabsRootProps["size"];
}) {
  const [value, setValue] = React.useState("1");

  return (
    <>
      <ChipTabsRoot variant={variant} size={size} value={value} onValueChange={setValue}>
        <ChipTabsList>
          <ChipTabsTrigger value="1">라벨1</ChipTabsTrigger>
          <ChipTabsTrigger value="2">라벨2</ChipTabsTrigger>
          <ChipTabsTrigger value="3">라벨3</ChipTabsTrigger>
        </ChipTabsList>
      </ChipTabsRoot>
      {value === "1" && <div>content 1</div>}
      {value === "2" && <div>content 2</div>}
      {value === "3" && <div>content 3</div>}
    </>
  );
}

export const story = defineStory({
  displayName: "ChipTabs",
  Component: withStoryPreview()(ChipTabsPreview),
  args: {
    initial: {
      variant: "neutralSolid",
      size: "medium",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
