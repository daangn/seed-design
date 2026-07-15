"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { IconFaceSmileCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Count, PrefixIcon } from "@seed-design/react";
import { ReactionButton, type ReactionButtonProps } from "seed-design/ui/reaction-button";

function ReactionButtonDemo({
  children,
  count,
  ...props
}: Pick<ReactionButtonProps, "size" | "loading" | "disabled"> & {
  children?: string;
  count?: string;
}) {
  return (
    <ReactionButton {...props}>
      <PrefixIcon svg={<IconFaceSmileCircleFill />} />
      {children}
      {count && <Count>{count}</Count>}
    </ReactionButton>
  );
}

export const story = defineStory({
  displayName: "ReactionButton",
  Component: withStoryPreview()(ReactionButtonDemo),
  args: {
    initial: {
      children: "도움돼요",
      count: "1",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
