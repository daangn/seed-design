"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Box } from "@seed-design/react";

type Spacing = "x1" | "x2" | "x3" | "x4" | "x5" | "x6" | "x8";
type Radius = "r1" | "r2" | "r3" | "r4" | "full";
type Shadow = "s1" | "s2" | "s3";

interface BoxPreviewProps {
  paddingX?: Spacing;
  paddingY?: Spacing;
  borderRadius?: Radius;
  boxShadow?: Shadow;
}

function BoxPreview({ paddingX, paddingY, borderRadius, boxShadow }: BoxPreviewProps) {
  return (
    <Box
      bg="bg.neutralWeak"
      borderWidth="2"
      borderColor="stroke.brandWeak"
      borderRadius={borderRadius}
      px={paddingX}
      py={paddingY}
      boxShadow={boxShadow}
    >
      Box Example
    </Box>
  );
}

export const story = defineStory({
  displayName: "Box",
  Component: withStoryPreview()(BoxPreview),
  args: {
    initial: {
      paddingX: "x3",
      paddingY: "x2",
      borderRadius: "r2",
      boxShadow: "s2",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
