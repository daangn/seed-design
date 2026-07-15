"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Switch, type SwitchProps } from "seed-design/ui/switch";

function SwitchPreview(props: Pick<SwitchProps, "size" | "tone" | "disabled">) {
  return <Switch defaultChecked {...props} />;
}

export const story = defineStory({
  Component: withStoryPreview()(SwitchPreview),
  args: {
    initial: {
      size: "32",
      tone: "brand",
      disabled: false,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
