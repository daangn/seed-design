"use client";

import { IconArrowClockwiseCircularFill, IconXmarkFill } from "@karrotmarket/react-monochrome-icon";
import { AttachmentDisplay as SeedAttachmentDisplay, Icon, VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";
import { ProgressCircle } from "seed-design/ui/progress-circle";

const LABEL_REMOVE = "삭제";
const LABEL_RETRY = "재시도";

function CustomImageItem({
  entry,
  isCover,
  onRetry,
}: {
  entry: DisplayItemEntry;
  isCover?: boolean;
  onRetry?: () => void;
}) {
  return (
    <SeedAttachmentDisplay.Item entry={entry}>
      <SeedAttachmentDisplay.ItemImage />
      {isCover && <SeedAttachmentDisplay.ItemBadge>대표사진</SeedAttachmentDisplay.ItemBadge>}
      <SeedAttachmentDisplay.ItemBackdrop status="uploading">
        {(e) => (
          <ProgressCircle
            size="24"
            tone="staticWhite"
            {...("progress" in e && { value: e.progress })}
          />
        )}
      </SeedAttachmentDisplay.ItemBackdrop>
      {onRetry && (
        <SeedAttachmentDisplay.ItemBackdrop status="error">
          <SeedAttachmentDisplay.ItemActionButton onClick={onRetry}>
            <Icon svg={<IconArrowClockwiseCircularFill />} />
            {LABEL_RETRY}
          </SeedAttachmentDisplay.ItemActionButton>
        </SeedAttachmentDisplay.ItemBackdrop>
      )}
      <SeedAttachmentDisplay.ItemRemoveButton aria-label={LABEL_REMOVE}>
        <Icon svg={<IconXmarkFill />} />
      </SeedAttachmentDisplay.ItemRemoveButton>
    </SeedAttachmentDisplay.Item>
  );
}

const defaultEntries: DisplayItemEntry[] = [
  { id: "1", thumbnailUrl: "https://picsum.photos/seed/customizing1/200/200", status: "success" },
  { id: "2", thumbnailUrl: "https://picsum.photos/seed/customizing2/200/200", status: "success" },
  { id: "3", thumbnailUrl: "https://picsum.photos/seed/customizing3/200/200", status: "success" },
];

export default function AttachmentDisplayCustomizingItems() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField defaultEntries={defaultEntries} maxEntries={10}>
        <AttachmentDisplay
          onTriggerClick={() => {
            // 외부 미디어 피커 호출 자리
          }}
        >
          {({ entries }) =>
            entries.map((entry, index) => (
              <CustomImageItem key={entry.id} entry={entry} isCover={index === 0} />
            ))
          }
        </AttachmentDisplay>
      </AttachmentDisplayField>
    </VStack>
  );
}
