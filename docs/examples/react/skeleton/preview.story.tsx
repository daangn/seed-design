"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Skeleton, type SkeletonProps, VStack } from "@seed-design/react";

function SkeletonPreview({ tone, radius }: Pick<SkeletonProps, "tone" | "radius">) {
  return (
    <VStack gap="x4" align="center">
      <Skeleton tone={tone} radius="full" width="x12" height="x12" />
      <VStack gap="x2">
        <Skeleton tone={tone} radius={radius} height="x4" width="250px" />
        <Skeleton tone={tone} radius={radius} height="x4" width="250px" />
      </VStack>
    </VStack>
  );
}

export const story = defineStory({
  displayName: "Skeleton",
  Component: withStoryPreview()(SkeletonPreview),
  args: {
    initial: {
      tone: "neutral",
      radius: "8",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
