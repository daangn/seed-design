"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { PageBanner, type PageBannerProps } from "seed-design/ui/page-banner";

interface PageBannerPreviewProps {
  tone?: PageBannerProps["tone"];
  description?: string;
}

function PageBannerPreview({ tone, description }: PageBannerPreviewProps) {
  return <PageBanner tone={tone} description={description} />;
}

export const story = defineStory({
  displayName: "PageBanner",
  Component: withStoryPreview()(PageBannerPreview),
  args: {
    initial: {
      tone: "neutral",
      description:
        "Ut veniam in ea ea anim laborum magna dolore ea laborum duis ut aute mollit amet.",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
