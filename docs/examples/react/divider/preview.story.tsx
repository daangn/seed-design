"use client";

import { Box, Divider, type DividerProps, HStack, VStack } from "@seed-design/react";
import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";

// Divider is a style-prop bag, so controls are curated to the meaningful axes
// (orientation drives the demo layout; thickness/color/inset are the real props
// worth tuning).
function DividerPreview(
  props: Pick<DividerProps, "orientation" | "inset" | "thickness" | "color">,
) {
  if (props.orientation === "vertical") {
    return (
      <HStack width="full" bg="bg.layerDefault" p="x4">
        <Box p="x4" flexGrow>
          왼쪽 영역의 내용입니다.
        </Box>
        <Divider {...props} />
        <Box p="x4" flexGrow>
          오른쪽 영역의 내용입니다.
        </Box>
      </HStack>
    );
  }

  return (
    <VStack width="full" bg="bg.layerDefault" p="x4">
      <Box p="x4">위쪽 영역의 내용입니다.</Box>
      <Divider {...props} />
      <Box p="x4">아래쪽 영역의 내용입니다.</Box>
    </VStack>
  );
}

export const story = defineStory({
  Component: withStoryPreview()(DividerPreview),
  args: {
    initial: {
      orientation: "horizontal",
      inset: false,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
