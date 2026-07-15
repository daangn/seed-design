"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import {
  ContentPlaceholder,
  type ContentPlaceholderProps,
} from "seed-design/ui/content-placeholder";

const ContentPlaceholderPreview = ({ type }: Pick<ContentPlaceholderProps, "type">) => (
  <ContentPlaceholder type={type} style={{ width: 200, height: 200 }} />
);

export const story = defineStory({
  displayName: "ContentPlaceholder",
  Component: withStoryPreview()(ContentPlaceholderPreview),
  args: {
    initial: {
      type: "default",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
