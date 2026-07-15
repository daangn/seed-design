"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

interface RadioGroupPreviewProps {
  label: string;
  description: string;
  indicator: string;
  size: "large" | "medium";
  tone: "neutral" | "brand";
  disabled: boolean;
}

function RadioGroupPreview({
  label,
  description,
  indicator,
  size,
  tone,
  disabled,
}: RadioGroupPreviewProps) {
  return (
    <VStack p="x6">
      <RadioGroup
        defaultValue="apple"
        label={label}
        description={description}
        indicator={indicator}
      >
        <RadioGroupItem value="apple" label="Apple" tone={tone} size={size} disabled={disabled} />
        <RadioGroupItem value="banana" label="Banana" tone={tone} size={size} disabled={disabled} />
        <RadioGroupItem value="orange" label="Orange" tone={tone} size={size} disabled={disabled} />
      </RadioGroup>
    </VStack>
  );
}

export const story = defineStory({
  displayName: "RadioGroup",
  Component: withStoryPreview()(RadioGroupPreview),
  args: {
    initial: {
      label: "좋아하는 과일",
      description: "좋아하는 과일을 선택해 주세요.",
      indicator: "선택",
      size: "large",
      tone: "neutral",
      disabled: false,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
