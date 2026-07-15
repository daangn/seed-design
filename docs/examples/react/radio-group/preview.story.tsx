"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { VStack } from "@seed-design/react";
import type { ComponentPropsWithoutRef } from "react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

// Controls come from RadioGroup's real group-level props; the items are fixed
// representatives (item-level props aren't misrepresented as group controls).
function RadioGroupPreview(props: ComponentPropsWithoutRef<typeof RadioGroup>) {
  return (
    <VStack p="x6">
      <RadioGroup {...props} defaultValue="apple">
        <RadioGroupItem value="apple" label="사과" />
        <RadioGroupItem value="banana" label="바나나" />
        <RadioGroupItem value="orange" label="오렌지" />
      </RadioGroup>
    </VStack>
  );
}

export const story = defineStory({
  // value/defaultValue are the controlled selection (a fixed one is hardcoded)
  Component: withStoryPreview<{
    children?: never;
    asChild?: never;
    value?: never;
    defaultValue?: never;
  }>()(RadioGroupPreview),
  args: {
    initial: {
      label: "좋아하는 과일",
      description: "좋아하는 과일을 선택해 주세요.",
      indicator: "선택",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
