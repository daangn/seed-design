"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { PageBanner } from "seed-design/ui/page-banner";

export const story = defineStory({
  Component: withStoryPreview<{ prefixIcon?: never }>()(PageBanner),
  args: {
    initial: {
      tone: "neutral",
      description: "페이지 상단에 표시되는 배너 문구입니다.",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
