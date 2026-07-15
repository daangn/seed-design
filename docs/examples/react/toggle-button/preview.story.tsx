"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { useState } from "react";
import { ToggleButton, type ToggleButtonProps } from "seed-design/ui/toggle-button";

function ToggleButtonDemo(
  props: Pick<ToggleButtonProps, "variant" | "size" | "loading" | "disabled">,
) {
  const [pressed, setPressed] = useState(false);

  return (
    <ToggleButton pressed={pressed} onPressedChange={setPressed} {...props}>
      {pressed ? "선택됨" : "미선택"}
    </ToggleButton>
  );
}

export const story = defineStory({
  Component: withStoryPreview()(ToggleButtonDemo),
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
