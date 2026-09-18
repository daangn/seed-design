import "@seed-design/lynx-css/base.css";

import IconArrowClockwiseCircularFill from "@karrotmarket/lynx-monochrome-icon/IconArrowClockwiseCircularFill";
import IconXmarkFill from "@karrotmarket/lynx-monochrome-icon/IconXmarkFill";
import { useRef, useState } from "@lynx-js/react";
import {
  AttachmentDisplay as SeedAttachmentDisplay,
  Icon,
  VStack,
  useSeedClassName,
} from "@seed-design/lynx-react";
import type { AttachmentDisplayEntry } from "@seed-design/lynx-react";
import {
  AttachmentDisplay,
  AttachmentDisplayField,
} from "@/components/ui/attachment-display-field";
import { ProgressCircle } from "@/components/ui/progress-circle";

const INITIAL_ENTRIES: AttachmentDisplayEntry[] = [
  {
    id: "customizing-1",
    thumbnailUrl: "https://picsum.photos/seed/customizing1/200/200",
    status: "success",
  },
  {
    id: "customizing-2",
    thumbnailUrl: "https://picsum.photos/seed/customizing2/200/200",
    status: "success",
  },
  {
    id: "customizing-3",
    thumbnailUrl: "https://picsum.photos/seed/customizing3/200/200",
    status: "success",
  },
];

export default function AttachmentDisplayCustomizingItems() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const nextId = useRef(0);
  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentDisplayField entries={entries} onEntriesChange={setEntries} maxEntries={10}>
          <AttachmentDisplay
            onTriggerTap={({ addEntries }) => {
              // 문서 고정 fixture입니다. 실제 앱에서는 호스트 picker 결과를 전달하세요.
              const id = `customizing-added-${nextId.current++}`;
              addEntries([
                { id, thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`, status: "success" },
              ]);
            }}
          >
            {({ entries: currentEntries }) =>
              currentEntries.map((entry, index) => (
                <CustomImageItem key={entry.id} entry={entry} isCover={index === 0} />
              ))
            }
          </AttachmentDisplay>
        </AttachmentDisplayField>
      </VStack>
    </view>
  );
}

function CustomImageItem({ entry, isCover }: { entry: AttachmentDisplayEntry; isCover: boolean }) {
  return (
    <SeedAttachmentDisplay.Item entry={entry}>
      <SeedAttachmentDisplay.ItemSurface>
        <SeedAttachmentDisplay.ItemImage />
        {isCover ? (
          <SeedAttachmentDisplay.ItemBadge>대표사진</SeedAttachmentDisplay.ItemBadge>
        ) : null}
        <SeedAttachmentDisplay.ItemBackdrop status="uploading">
          {(item) => (
            <ProgressCircle
              size="24"
              tone="staticWhite"
              {...("progress" in item ? { value: item.progress } : {})}
            />
          )}
        </SeedAttachmentDisplay.ItemBackdrop>
        <SeedAttachmentDisplay.ItemBackdrop status="error">
          <SeedAttachmentDisplay.ItemActionButton bindtap={() => {}}>
            <Icon icon={<IconArrowClockwiseCircularFill />} />
            재시도
          </SeedAttachmentDisplay.ItemActionButton>
        </SeedAttachmentDisplay.ItemBackdrop>
      </SeedAttachmentDisplay.ItemSurface>
      <SeedAttachmentDisplay.ItemRemoveButton accessibility-label="파일 제거">
        <Icon icon={<IconXmarkFill />} />
      </SeedAttachmentDisplay.ItemRemoveButton>
    </SeedAttachmentDisplay.Item>
  );
}
