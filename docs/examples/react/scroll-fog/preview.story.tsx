"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Box, ScrollFog, VStack } from "@seed-design/react";
import type { ComponentPropsWithoutRef } from "react";

// Controls come from ScrollFog's real props (placement/size/hideScrollBar); the
// scrollable content is fixed.
function ScrollFogPreview(props: ComponentPropsWithoutRef<typeof ScrollFog>) {
  return (
    <div
      style={{
        maxHeight: "200px",
        width: "300px",
        border: "1px solid var(--seed-color-stroke-neutral-weak)",
        borderRadius: "8px",
      }}
    >
      <ScrollFog {...props}>
        <VStack gap="x4" px="x4" py="20px" width="full">
          {Array.from({ length: 20 }, (_, index) => (
            <Box key={index} bg="gray" px="x4" py="x3" borderRadius="r2">
              {index + 1}
            </Box>
          ))}
        </VStack>
      </ScrollFog>
    </div>
  );
}

export const story = defineStory({
  // sizes is object plumbing (per-placement size overrides)
  Component: withStoryPreview<{ children?: never; sizes?: never }>()(ScrollFogPreview),
  args: {
    initial: {
      placement: ["top", "bottom"],
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
