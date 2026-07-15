"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Box } from "@seed-design/react";
import { Avatar, AvatarBadge, type AvatarProps } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

function AvatarPreview({
  size,
  badgeMask,
  src,
  showBadge,
}: {
  size?: AvatarProps["size"];
  badgeMask?: AvatarProps["badgeMask"];
  /** 비워두면 fallback(IdentityPlaceholder)이 보입니다 */
  src?: string;
  showBadge?: boolean;
}) {
  return (
    <Avatar size={size} badgeMask={badgeMask} src={src} fallback={<IdentityPlaceholder />}>
      {showBadge && (
        <AvatarBadge>
          <Box borderRadius="full" bg="palette.green600" width="x6" height="x6" />
        </AvatarBadge>
      )}
    </Avatar>
  );
}

export const story = defineStory({
  displayName: "Avatar",
  Component: withStoryPreview()(AvatarPreview),
  args: {
    initial: {
      size: "80",
      badgeMask: "circle",
      src: "https://avatars.githubusercontent.com/u/54893898?v=4",
      showBadge: true,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
