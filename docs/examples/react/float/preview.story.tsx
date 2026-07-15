"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Box, Float } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

type Placement =
  | "top-start"
  | "top-center"
  | "top-end"
  | "middle-start"
  | "middle-center"
  | "middle-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end";
type Offset = "0" | "x2" | "x4" | "x6" | "x8";

interface FloatPreviewProps {
  placement?: Placement;
  offsetX?: Offset;
  offsetY?: Offset;
}

function FloatPreview({ placement = "top-start", offsetX, offsetY }: FloatPreviewProps) {
  return (
    <Box
      position="relative"
      width="320px"
      height="320px"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <Float placement={placement} offsetX={offsetX} offsetY={offsetY}>
        <ContextualFloatingButton>Floating Button</ContextualFloatingButton>
      </Float>
    </Box>
  );
}

export const story = defineStory({
  displayName: "Float",
  Component: withStoryPreview()(FloatPreview),
  args: {
    initial: {
      placement: "top-start",
      offsetX: "0",
      offsetY: "0",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
