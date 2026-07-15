"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { VStack } from "@seed-design/react";
import type { ComponentPropsWithoutRef } from "react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

// Panel 1 — CheckboxGroup: the group-level axes. Items are fixed representatives
// (which also showcase the square/ghost item variant).
function CheckboxGroupPreview(props: ComponentPropsWithoutRef<typeof CheckboxGroup>) {
  return (
    <VStack p="x6">
      <CheckboxGroup {...props}>
        <Checkbox label="디자인" variant="square" defaultChecked />
        <Checkbox label="개발" variant="square" />
        <Checkbox label="마케팅" variant="ghost" />
      </CheckboxGroup>
    </VStack>
  );
}

export const groupStory = defineStory({
  Component: withStoryPreview<{ children?: never; asChild?: never }>()(CheckboxGroupPreview),
  args: {
    initial: {
      label: "관심 분야",
      description: "관심 있는 분야를 모두 선택해 주세요.",
      indicator: "선택",
    },
  },
});

// Panel 2 — a single Checkbox: the item-level axes (variant/tone/size/…), which
// aren't group props. This is what lets the child item be tuned from the UI.
export const itemStory = defineStory({
  // children is dead (the item composes its own control/label/input); checked is
  // controlled state that needs a handler — keep defaultChecked instead
  Component: withStoryPreview<{
    children?: never;
    checked?: never;
    inputProps?: never;
    rootRef?: never;
    asChild?: never;
  }>()(Checkbox),
  args: {
    initial: {
      label: "동의합니다",
    },
  },
});

// checkbox is one component with two facets (group + item), so both panels are
// composed behind a single Preview rather than split across the page.
export function Preview() {
  return (
    <div className="flex flex-col gap-4">
      <groupStory.WithControl />
      <itemStory.WithControl />
    </div>
  );
}
