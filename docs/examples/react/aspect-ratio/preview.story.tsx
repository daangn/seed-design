"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { AspectRatio, Text } from "@seed-design/react";

function AspectRatioPreview({
  ratio = 4 / 3,
}: {
  /** 컨테이너의 비율 (width / height) */
  ratio?: number;
}) {
  return (
    <AspectRatio ratio={ratio} width="160px" bg="palette.gray100">
      <Text color="palette.gray700">{Math.round(ratio * 100) / 100}</Text>
    </AspectRatio>
  );
}

export const story = defineStory({
  displayName: "AspectRatio",
  Component: withStoryPreview()(AspectRatioPreview),
  args: {
    initial: {
      ratio: 4 / 3,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
