"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { VStack } from "@seed-design/react";
import type { ComponentPropsWithoutRef } from "react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

// select-box ships two distinct components; each gets its own panel bound to its
// real group-level props (a single panel can only drive one component).

// Panel 1 — CheckSelectBoxGroup (multi-select).
function CheckSelectBoxPreview(props: ComponentPropsWithoutRef<typeof CheckSelectBoxGroup>) {
  return (
    <VStack gap="x2" width="320px">
      <CheckSelectBoxGroup {...props} aria-label="과일">
        <CheckSelectBox label="사과" defaultChecked suffix={<CheckSelectBoxCheckmark />} />
        <CheckSelectBox
          label="멜론"
          description="달콤한 여름 과일"
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox label="망고" suffix={<CheckSelectBoxCheckmark />} />
      </CheckSelectBoxGroup>
    </VStack>
  );
}

export const checkStory = defineStory({
  Component: withStoryPreview<{ children?: never; asChild?: never }>()(CheckSelectBoxPreview),
  args: {},
});

export const CheckPreview = checkStory.WithControl;

// Panel 2 — RadioSelectBoxRoot (single-select).
function RadioSelectBoxPreview(props: ComponentPropsWithoutRef<typeof RadioSelectBoxRoot>) {
  return (
    <VStack gap="x2" width="320px">
      <RadioSelectBoxRoot {...props} defaultValue="apple" aria-label="과일">
        <RadioSelectBoxItem value="apple" label="사과" suffix={<RadioSelectBoxRadiomark />} />
        <RadioSelectBoxItem
          value="melon"
          label="멜론"
          description="달콤한 여름 과일"
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem value="mango" label="망고" suffix={<RadioSelectBoxRadiomark />} />
      </RadioSelectBoxRoot>
    </VStack>
  );
}

export const radioStory = defineStory({
  // value/defaultValue are the controlled selection (a fixed one is hardcoded)
  Component: withStoryPreview<{
    children?: never;
    asChild?: never;
    value?: never;
    defaultValue?: never;
  }>()(RadioSelectBoxPreview),
  args: {},
});

export const RadioPreview = radioStory.WithControl;
