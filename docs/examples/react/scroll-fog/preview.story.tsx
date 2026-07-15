"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Box, ScrollFog, VStack } from "@seed-design/react";

type Placement = "top" | "bottom" | "both";

const PLACEMENT_MAP = {
  top: ["top"],
  bottom: ["bottom"],
  both: ["top", "bottom"],
} as const satisfies Record<Placement, ReadonlyArray<"top" | "bottom">>;

interface ScrollFogPreviewProps {
  itemCount?: number;
  placement?: Placement;
}

function ScrollFogPreview({ itemCount = 20, placement = "both" }: ScrollFogPreviewProps) {
  return (
    <div
      style={{
        maxHeight: "200px",
        width: "300px",
        border: "1px solid var(--seed-color-stroke-neutral-weak)",
        borderRadius: "8px",
      }}
    >
      <ScrollFog placement={[...PLACEMENT_MAP[placement]]}>
        <VStack gap="x4" px="x4" py="20px" width="full">
          {Array.from({ length: itemCount }, (_, index) => (
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
  displayName: "ScrollFog",
  Component: withStoryPreview()(ScrollFogPreview),
  args: {
    initial: {
      itemCount: 20,
      placement: "both",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
