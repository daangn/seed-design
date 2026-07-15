"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Slider } from "seed-design/ui/slider";

interface SliderPreviewProps {
  min: number;
  max: number;
  disabled?: boolean;
}

function SliderPreview({ min, max, disabled }: SliderPreviewProps) {
  return (
    <Slider
      min={min}
      max={max}
      disabled={disabled}
      defaultValues={[50]}
      getAriaLabel={() => "값"}
    />
  );
}

export const story = defineStory({
  displayName: "Slider",
  Component: withStoryPreview()(SliderPreview),
  args: {
    initial: {
      min: 0,
      max: 100,
      disabled: false,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
