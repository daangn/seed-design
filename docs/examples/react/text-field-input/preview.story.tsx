"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import type { ComponentPropsWithoutRef } from "react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

// Controls come from TextField's real field-level props (label/description/
// errorMessage/size/maxGraphemeCount/…); the input is fixed.
function TextFieldInputStory(props: ComponentPropsWithoutRef<typeof TextField>) {
  return (
    <TextField {...props}>
      <TextFieldInput autoFocus placeholder="입력하세요" />
    </TextField>
  );
}

export const story = defineStory({
  // value is controlled; fieldRef is a ref; prefixIcon/suffixIcon are icon slots
  // (not meaningful as string widgets — prefix/suffix text addons stay)
  Component: withStoryPreview<{
    children?: never;
    value?: never;
    fieldRef?: never;
    prefixIcon?: never;
    suffixIcon?: never;
  }>()(TextFieldInputStory),
  args: {
    initial: {
      label: "라벨",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
