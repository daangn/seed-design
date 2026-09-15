import "@seed-design/lynx-css/base.css";

import { useRef } from "@lynx-js/react";
import type {
  AttachmentDisplayEntry,
  AttachmentDisplayStatusDetails,
} from "@seed-design/lynx-react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  AttachmentDisplay,
  AttachmentDisplayField,
} from "@/components/ui/attachment-display-field";

const INITIAL_ENTRIES: AttachmentDisplayEntry[] = [
  {
    id: "upload-1",
    thumbnailUrl: "https://picsum.photos/seed/upload1/200/200",
    status: "uploading",
    progress: 30,
  },
  { id: "upload-2", thumbnailUrl: "https://picsum.photos/seed/upload2/200/200", status: "success" },
  { id: "upload-3", thumbnailUrl: "https://picsum.photos/seed/upload3/200/200", status: "error" },
];

function runFixtureUpload(
  id: string,
  updateEntryStatus: (id: string, details: AttachmentDisplayStatusDetails) => void,
) {
  updateEntryStatus(id, { status: "uploading", progress: 0 });
  updateEntryStatus(id, { status: "uploading", progress: 25 });
  updateEntryStatus(id, { status: "uploading", progress: 60 });
  updateEntryStatus(id, { status: "success" });
}

export default function AttachmentDisplayStatus() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const nextId = useRef(0);

  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentDisplayField defaultEntries={INITIAL_ENTRIES} maxEntries={5}>
          <AttachmentDisplay
            onTriggerTap={({ addEntries, updateEntryStatus }) => {
              // 문서 고정 fixture입니다. 실제 앱에서는 host upload operation을 시작하세요.
              const id = `upload-added-${nextId.current++}`;
              addEntries([
                {
                  id,
                  thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
                  status: "uploading",
                },
              ]);
              runFixtureUpload(id, updateEntryStatus);
            }}
            onRetry={(entry, { updateEntryStatus }) =>
              runFixtureUpload(entry.id, updateEntryStatus)
            }
          />
        </AttachmentDisplayField>
      </VStack>
    </view>
  );
}
