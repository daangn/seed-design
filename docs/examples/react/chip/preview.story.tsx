"use client";

import { HStack, VStack } from "@seed-design/react";
import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Chip, type ButtonChipProps } from "seed-design/ui/chip";

function ChipPreview({
  variant,
  size,
}: {
  variant?: ButtonChipProps["variant"];
  size?: ButtonChipProps["size"];
}) {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button variant={variant} size={size}>
          <Chip.Label>Button Chip</Chip.Label>
        </Chip.Button>
        <Chip.Toggle variant={variant} size={size}>
          <Chip.Label>Toggle Chip</Chip.Label>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1" variant={variant} size={size}>
            <Chip.Label>Radio Chip 1</Chip.Label>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2" variant={variant} size={size}>
            <Chip.Label>Radio Chip 2</Chip.Label>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}

export const story = defineStory({
  displayName: "Chip",
  Component: withStoryPreview()(ChipPreview),
  args: {
    initial: {
      variant: "solid",
      size: "medium",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
