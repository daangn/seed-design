"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { VStack } from "@seed-design/react";
import type { ComponentPropsWithoutRef } from "react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

// Controls come from AttachmentField's real props (a field composite with a rich
// prop surface); the input body is fixed.
function AttachmentFieldPreview(props: ComponentPropsWithoutRef<typeof AttachmentField>) {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField {...props}>
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}

export const story = defineStory({
  // never the escape-hatch plumbing (ref & prop-bag props) and the controlled
  // file-entry state — none render as a usable control widget
  Component: withStoryPreview<{
    children?: never;
    inputProps?: never;
    fieldRef?: never;
    rootProps?: never;
    acceptedFileEntries?: never;
    defaultAcceptedFileEntries?: never;
  }>()(AttachmentFieldPreview),
  args: {
    initial: {
      label: "파일 업로드",
      description: "최대 3개까지 업로드할 수 있습니다",
      maxFiles: 3,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
