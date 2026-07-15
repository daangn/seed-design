"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import {
  ContextualFloatingButton,
  type ContextualFloatingButtonProps,
} from "seed-design/ui/contextual-floating-button";

function ContextualFloatingButtonDemo({
  children,
  ...props
}: Pick<ContextualFloatingButtonProps, "variant" | "loading"> & { children?: string }) {
  return (
    <ContextualFloatingButton {...props}>
      <PrefixIcon svg={<IconBellFill />} />
      {children}
    </ContextualFloatingButton>
  );
}

export const story = defineStory({
  displayName: "ContextualFloatingButton",
  Component: withStoryPreview()(ContextualFloatingButtonDemo),
  args: {
    initial: {
      children: "알림 설정",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
