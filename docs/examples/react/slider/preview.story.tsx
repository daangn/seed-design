"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import type { ComponentPropsWithoutRef } from "react";
import { Slider } from "seed-design/ui/slider";

// Controls come from Slider's real props (min/max/step/invalid/readOnly/…); the
// value is fixed.
function SliderPreview(props: ComponentPropsWithoutRef<typeof Slider>) {
  return <Slider {...props} defaultValues={[50]} getAriaLabel={() => "값"} />;
}

export const story = defineStory({
  // values/defaultValues are the controlled selection (a fixed one is used);
  // fieldRef is a ref and markers is object plumbing
  Component: withStoryPreview<{
    children?: never;
    asChild?: never;
    values?: never;
    defaultValues?: never;
    fieldRef?: never;
    markers?: never;
  }>()(SliderPreview),
  args: {
    initial: {
      min: 0,
      max: 100,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
