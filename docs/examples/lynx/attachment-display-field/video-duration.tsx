import IconXmarkFill from "@karrotmarket/lynx-monochrome-icon/IconXmarkFill";
import { AttachmentDisplay as SeedAttachmentDisplay, Icon, VStack } from "@seed-design/lynx-react";
import type { AttachmentDisplayEntry } from "@seed-design/lynx-react";
import {
  AttachmentDisplay,
  AttachmentDisplayField,
  AttachmentDisplayItem,
  AttachmentDisplayItemDurationBadge,
} from "@/components/ui/attachment-display-field";

const DEFAULT_ENTRIES: AttachmentDisplayEntry[] = [
  {
    id: "duration-1",
    thumbnailUrl: "https://picsum.photos/seed/duration1/200/200",
    status: "success",
  },
  {
    id: "duration-2",
    thumbnailUrl: "https://picsum.photos/seed/duration2/200/200",
    status: "success",
  },
  {
    id: "duration-3",
    thumbnailUrl: "https://picsum.photos/seed/duration3/200/200",
    status: "success",
  },
];

// 문서 고정 fixture입니다. 호스트 미디어 picker가 동영상의 썸네일 URL과 재생시간(초)을 함께 준다고 가정합니다.
const VIDEO_SECONDS = new Map([
  ["duration-2", 125],
  ["duration-3", 3725],
]);

function MediaItem({ entry }: { entry: AttachmentDisplayEntry }) {
  const seconds = VIDEO_SECONDS.get(entry.id);

  return (
    <AttachmentDisplayItem entry={entry}>
      <SeedAttachmentDisplay.ItemSurface>
        <SeedAttachmentDisplay.ItemImage />
        {seconds === undefined ? null : <AttachmentDisplayItemDurationBadge seconds={seconds} />}
      </SeedAttachmentDisplay.ItemSurface>
      <SeedAttachmentDisplay.ItemRemoveButton accessibility-label="파일 제거">
        <Icon icon={<IconXmarkFill />} />
      </SeedAttachmentDisplay.ItemRemoveButton>
    </AttachmentDisplayItem>
  );
}

export default function AttachmentDisplayVideoDuration() {
  return (
    <VStack gap="x4" width="100%">
      <AttachmentDisplayField defaultEntries={DEFAULT_ENTRIES} maxEntries={10}>
        <AttachmentDisplay
          onTriggerTap={() => {
            // 호스트 미디어 picker 호출 자리
          }}
        >
          {({ entries }) => entries.map((entry) => <MediaItem key={entry.id} entry={entry} />)}
        </AttachmentDisplay>
      </AttachmentDisplayField>
    </VStack>
  );
}
