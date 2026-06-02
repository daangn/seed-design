"use client";

import { VStack } from "@seed-design/react";
import type { DisplayItemEntry, DisplayItemStatusDetails } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const defaultEntries: DisplayItemEntry[] = [
  {
    id: "1",
    thumbnailUrl: "https://picsum.photos/seed/upload1/200/200",
    status: "uploading",
    progress: 30,
  },
  {
    id: "2",
    thumbnailUrl: "https://picsum.photos/seed/upload2/200/200",
    status: "success",
  },
  {
    id: "3",
    thumbnailUrl: "https://picsum.photos/seed/upload3/200/200",
    status: "error",
  },
];

// 외부 미디어 피커 모킹. 실제 환경에서는 네이티브 브릿지/모달/서버 호출 등으로 교체하세요.
async function openMediaPicker(): Promise<DisplayItemEntry[]> {
  const id = crypto.randomUUID();
  return [
    {
      id,
      thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
      status: "uploading",
    },
  ];
}

// 실제 환경에서는 네이티브 브릿지 또는 외부 업로드 API와 연동하세요.
// status는 컴포넌트가 콜백으로 전달하는 updateEntryStatus 헬퍼로만 갱신합니다.
function simulateUpload(
  id: string,
  updateEntryStatus: (id: string, details: DisplayItemStatusDetails) => void,
) {
  updateEntryStatus(id, { status: "uploading", progress: 0 });

  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;
    if (progress >= 100) {
      clearInterval(interval);
      updateEntryStatus(id, Math.random() > 0.5 ? { status: "success" } : { status: "error" });
    } else {
      updateEntryStatus(id, { status: "uploading", progress });
    }
  }, 300);
}

export default function AttachmentDisplayStatus() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField defaultEntries={defaultEntries} maxEntries={5}>
        <AttachmentDisplay
          onTriggerClick={async ({ addEntries, updateEntryStatus }) => {
            const pickedEntries = await openMediaPicker();
            addEntries(pickedEntries);
            for (const entry of pickedEntries) {
              simulateUpload(entry.id, updateEntryStatus);
            }
          }}
          onRetry={(entry, { updateEntryStatus }) => simulateUpload(entry.id, updateEntryStatus)}
        />
      </AttachmentDisplayField>
    </VStack>
  );
}
