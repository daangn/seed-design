"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Box, Divider, type DividerProps, HStack, VStack } from "@seed-design/react";

function DividerPreview({ orientation, inset }: Pick<DividerProps, "orientation" | "inset">) {
  if (orientation === "vertical") {
    return (
      <HStack width="full" bg="bg.layerDefault" p="x4">
        <Box p="x4" flexGrow>
          Nisi elit pariatur incididunt quis fugiat mollit ipsum fugiat duis culpa esse incididunt
          cupidatat.
        </Box>
        <Divider orientation="vertical" inset={inset} />
        <Box p="x4" flexGrow>
          Consectetur voluptate quis do culpa et culpa.
        </Box>
      </HStack>
    );
  }

  return (
    <VStack width="full" bg="bg.layerDefault" p="x4">
      <Box p="x4">
        Nisi elit pariatur incididunt quis fugiat mollit ipsum fugiat duis culpa esse incididunt
        cupidatat.
      </Box>
      <Divider inset={inset} />
      <Box p="x4">Consectetur voluptate quis do culpa et culpa.</Box>
    </VStack>
  );
}

export const story = defineStory({
  displayName: "Divider",
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
