"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import type { ComponentPropsWithoutRef } from "react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

// Controls come from ContextualFloatingButton's real props (variant/layout/
// loading/disabled); the icon and label are fixed.
function ContextualFloatingButtonDemo(
  props: ComponentPropsWithoutRef<typeof ContextualFloatingButton>,
) {
  return (
    <ContextualFloatingButton {...props}>
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ContextualFloatingButton>
  );
}

export const story = defineStory({
  Component: withStoryPreview<{ children?: never; asChild?: never }>()(
    ContextualFloatingButtonDemo,
  ),
  args: {},
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
