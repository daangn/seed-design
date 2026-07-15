"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Box, Flex } from "@seed-design/react";

type Direction = "row" | "column" | "row-reverse" | "column-reverse";
type Align = "flex-start" | "flex-end" | "center" | "stretch";
type Justify = "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
type Gap = "x1" | "x2" | "x3" | "x4" | "x6";
type Wrap = "nowrap" | "wrap" | "wrap-reverse";

interface FlexPreviewProps {
  direction?: Direction;
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
}

function FlexPreview({ direction, gap, align, justify, wrap }: FlexPreviewProps) {
  return (
    <Flex
      direction={direction}
      gap={gap}
      align={align}
      justify={justify}
      wrap={wrap}
      bg="bg.layerDefault"
      width="full"
      borderRadius="r2"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Box key={index} bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
          {index + 1}
        </Box>
      ))}
    </Flex>
  );
}

export const story = defineStory({
  displayName: "Flex",
  Component: withStoryPreview()(FlexPreview),
  args: {
    initial: {
      direction: "row",
      gap: "x2",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
