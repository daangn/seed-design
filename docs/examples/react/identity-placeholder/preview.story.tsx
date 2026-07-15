"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export const story = defineStory({
  displayName: "IdentityPlaceholder",
  // IdentityPlaceholder types `children` (inherited HTML attrs on the primitive
  // Root) but never renders it — Root's fixed <Image/> overrides any passed
  // children, so a `children` control would be dead. `children?: never` drops it.
  // The correct fix is upstream: omit `children` from IdentityPlaceholderProps so
  // the type stops advertising a slot the component doesn't have.
  Component: withStoryPreview<{ children?: never }>()(IdentityPlaceholder),
  args: {
    initial: {
      identity: "person",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
