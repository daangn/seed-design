"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Flex, Grid } from "@seed-design/react";

type Gap = "x1" | "x2" | "x3" | "x4" | "x6";
type AutoFlow = "row" | "column" | "row dense" | "column dense";

interface GridPreviewProps {
  columns?: number;
  gap?: Gap;
  autoFlow?: AutoFlow;
  count?: number;
}

function GridPreview({ columns = 3, gap, autoFlow, count = 6 }: GridPreviewProps) {
  return (
    <Grid columns={columns} gap={gap} autoFlow={autoFlow} width="full" p="x8">
      {Array.from({ length: count }).map((_, index) => (
        <Flex
          key={index}
          bg="palette.purple300"
          color="palette.purple700"
          borderRadius="r2"
          align="center"
          justify="center"
          px="x4"
          py="x3"
        >
          {index + 1}
        </Flex>
      ))}
    </Grid>
  );
}

export const story = defineStory({
  displayName: "Grid",
  Component: withStoryPreview()(GridPreview),
  args: {
    initial: {
      columns: 3,
      gap: "x2",
      count: 6,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
