"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Callout } from "seed-design/ui/callout";

type Tone = "neutral" | "informative" | "positive" | "warning" | "critical" | "magic";

interface CalloutPreviewProps {
  tone?: Tone;
  description: string;
}

function CalloutPreview({ tone, description }: CalloutPreviewProps) {
  return <Callout tone={tone} description={description} />;
}

export const story = defineStory({
  displayName: "Callout",
  Component: withStoryPreview()(CalloutPreview),
  args: {
    initial: {
      tone: "neutral",
      description: "Aute nulla proident tempor minim eiusmod. In nostrud officia irure laborum.",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
