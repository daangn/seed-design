"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import type { ComponentPropsWithoutRef } from "react";
import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";

// Controls come from FieldButton's real props (label/description/showClearButton/
// readOnly/…); the button behavior and displayed value are fixed.
function FieldButtonDemo(props: ComponentPropsWithoutRef<typeof FieldButton>) {
  return (
    <FieldButton
      {...props}
      buttonProps={{
        onClick: () => window.alert("버튼 클릭됨"),
        "aria-label": "선택",
      }}
    >
      <FieldButtonValue>선택된 값</FieldButtonValue>
    </FieldButton>
  );
}

export const story = defineStory({
  // buttonProps is object plumbing; children is the fixed value display; values
  // is controlled state; rootRef is a ref; prefixIcon/suffixIcon are icon slots
  Component: withStoryPreview<{
    children?: never;
    asChild?: never;
    buttonProps?: never;
    values?: never;
    rootRef?: never;
    prefixIcon?: never;
    suffixIcon?: never;
  }>()(FieldButtonDemo),
  args: {
    initial: {
      label: "레이블",
      description: "버튼에 대한 설명을 작성해주세요",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
