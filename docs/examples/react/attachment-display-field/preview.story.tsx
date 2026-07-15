"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import type { ComponentPropsWithoutRef } from "react";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const sampleEntries: DisplayItemEntry[] = [
  {
    id: "1",
    thumbnailUrl: "https://picsum.photos/seed/seed1/200/200",
    status: "success",
  },
  {
    id: "2",
    thumbnailUrl: "https://picsum.photos/seed/seed2/200/200",
    status: "success",
  },
];

// 외부 미디어 피커 모킹. 실제 환경에서는 네이티브 브릿지/모달/서버 호출 등으로 교체하세요.
async function openMediaPicker(): Promise<DisplayItemEntry[]> {
  const id = crypto.randomUUID();
  return [
    {
      id,
      thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
      status: "success",
    },
  ];
}

// Controls come from AttachmentDisplayField's real props; the display body and
// the seed entries are fixed.
function AttachmentDisplayFieldPreview(
  props: ComponentPropsWithoutRef<typeof AttachmentDisplayField>,
) {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField {...props} defaultEntries={sampleEntries}>
        <AttachmentDisplay
          onTriggerClick={async ({ addEntries }) => {
            addEntries(await openMediaPicker());
          }}
        />
      </AttachmentDisplayField>
    </VStack>
  );
}

export const story = defineStory({
  // entries/defaultEntries are the controlled item state (a fixed seed is used)
  Component: withStoryPreview<{
    children?: never;
    entries?: never;
    defaultEntries?: never;
  }>()(AttachmentDisplayFieldPreview),
  args: {},
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
