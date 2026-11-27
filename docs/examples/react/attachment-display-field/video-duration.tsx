"use client";

import { IconXmarkFill } from "@karrotmarket/react-monochrome-icon";
import {
  AttachmentDisplay as SeedAttachmentDisplay,
  Icon,
  VStack,
  type AttachmentDisplayItemEntry,
} from "@seed-design/react";
import {
  AttachmentDisplay,
  AttachmentDisplayField,
  AttachmentDisplayItemDurationBadge,
} from "seed-design/ui/attachment-display-field";

const LABEL_REMOVE = "삭제";

const defaultEntries: AttachmentDisplayItemEntry[] = [
  { id: "1", thumbnailUrl: "https://picsum.photos/seed/duration1/200/200", status: "success" },
  { id: "2", thumbnailUrl: "https://picsum.photos/seed/duration2/200/200", status: "success" },
  { id: "3", thumbnailUrl: "https://picsum.photos/seed/duration3/200/200", status: "success" },
];

// 외부 미디어 피커가 동영상의 썸네일 URL과 재생시간(초)을 함께 돌려준다고 가정한다.
const videoDurations = new Map([
  ["2", 125],
  ["3", 3725],
]);

function MediaItem({ entry }: { entry: AttachmentDisplayItemEntry }) {
  const seconds = videoDurations.get(entry.id);

  return (
    <SeedAttachmentDisplay.Item entry={entry}>
      <SeedAttachmentDisplay.ItemImage />
      {seconds !== undefined && <AttachmentDisplayItemDurationBadge seconds={seconds} />}
      <SeedAttachmentDisplay.ItemRemoveButton aria-label={LABEL_REMOVE}>
        <Icon svg={<IconXmarkFill />} />
      </SeedAttachmentDisplay.ItemRemoveButton>
    </SeedAttachmentDisplay.Item>
  );
}

export default function AttachmentDisplayVideoDuration() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField defaultEntries={defaultEntries} maxEntries={10}>
        <AttachmentDisplay
          onTriggerClick={() => {
            // 외부 미디어 피커 호출 자리
          }}
        >
          {({ entries }) => entries.map((entry) => <MediaItem key={entry.id} entry={entry} />)}
        </AttachmentDisplay>
      </AttachmentDisplayField>
    </VStack>
  );
}
