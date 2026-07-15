"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Box, VStack } from "@seed-design/react";

type Align = "flex-start" | "flex-end" | "center" | "stretch";
type Justify = "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
type Gap = "x1" | "x2" | "x3" | "x4" | "x6";

interface VStackPreviewProps {
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  count?: number;
}

function VStackPreview({ gap, align, justify, count = 3 }: VStackPreviewProps) {
  return (
    <VStack
      bg="bg.layerDefault"
      gap={gap}
      align={align}
      justify={justify}
      width="full"
      borderRadius="r2"
    >
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
          {index + 1}
        </Box>
      ))}
    </VStack>
  );
}

export const story = defineStory({
  displayName: "VStack",
  Component: withStoryPreview()(VStackPreview),
  args: {
    initial: {
      gap: "x2",
      count: 3,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
