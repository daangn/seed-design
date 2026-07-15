"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { VStack } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

interface AttachmentFieldPreviewProps {
  maxFiles?: number;
  label?: string;
  description?: string;
}

function AttachmentFieldPreview({ maxFiles, label, description }: AttachmentFieldPreviewProps) {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField maxFiles={maxFiles} label={label} description={description}>
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}

export const story = defineStory({
  displayName: "AttachmentField",
  Component: withStoryPreview()(AttachmentFieldPreview),
  args: {
    initial: {
      maxFiles: 3,
      label: "파일 업로드",
      description: "최대 3개까지 업로드할 수 있습니다",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
