"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { VStack } from "@seed-design/react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

interface CheckboxPreviewProps {
  label: string;
  description: string;
  indicator: string;
  size: "large" | "medium";
  tone: "neutral" | "brand";
  disabled: boolean;
}

function CheckboxPreview({
  label,
  description,
  indicator,
  size,
  tone,
  disabled,
}: CheckboxPreviewProps) {
  return (
    <VStack p="x6">
      <CheckboxGroup label={label} description={description} indicator={indicator}>
        <Checkbox label="디자인" tone={tone} size={size} disabled={disabled} />
        <Checkbox label="개발" tone={tone} size={size} disabled={disabled} defaultChecked />
        <Checkbox label="마케팅" tone={tone} size={size} disabled={disabled} />
      </CheckboxGroup>
    </VStack>
  );
}

export const story = defineStory({
  displayName: "Checkbox",
  Component: withStoryPreview()(CheckboxPreview),
  args: {
    initial: {
      label: "관심 분야",
      description: "관심 있는 분야를 모두 선택해 주세요.",
      indicator: "선택",
      size: "large",
      tone: "neutral",
      disabled: false,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
