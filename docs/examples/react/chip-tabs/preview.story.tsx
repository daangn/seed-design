"use client";

import * as React from "react";
import type { ComponentPropsWithoutRef } from "react";
import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "seed-design/ui/chip-tabs";

// Controls come from ChipTabsRoot's real group-level props (variant/size/…); the
// triggers and content are fixed, and the selection is kept in local state.
function ChipTabsPreview(props: ComponentPropsWithoutRef<typeof ChipTabsRoot>) {
  const [value, setValue] = React.useState("1");

  return (
    <>
      <ChipTabsRoot {...props} value={value} onValueChange={setValue}>
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
  // value/onValueChange are the controlled selection (kept in local state)
  Component: withStoryPreview<{
    children?: never;
    asChild?: never;
    value?: never;
    onValueChange?: never;
    defaultValue?: never;
  }>()(ChipTabsPreview),
  args: {},
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
