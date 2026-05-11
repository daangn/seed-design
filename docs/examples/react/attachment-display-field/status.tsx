import { VStack } from "@seed-design/react";
import type { DisplayItemEntry, DisplayItemStatusDetails } from "@seed-design/react/primitive";
import { useCallback, useState } from "react";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

// 실제 환경에서는 네이티브 브릿지 또는 외부 API와 연동하세요.
function simulateUpload(
  id: string,
  updateStatus: (id: string, details: DisplayItemStatusDetails) => void,
) {
  updateStatus(id, { status: "uploading", progress: 0 });

  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;
    if (progress >= 100) {
      clearInterval(interval);
      updateStatus(id, Math.random() > 0.5 ? { status: "success" } : { status: "error" });
    } else {
      updateStatus(id, { status: "uploading", progress });
    }
  }, 300);
}

export default function AttachmentDisplayStatus() {
  const [entries, setEntries] = useState<DisplayItemEntry[]>([
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
  ]);

  const updateEntryStatus = useCallback((id: string, details: DisplayItemStatusDetails) => {
    setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...details } : entry)));
  }, []);

  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField entries={entries} onEntriesChange={setEntries} maxEntries={5}>
        <AttachmentDisplay
          onTriggerClick={() => {
            // 외부 미디어 피커를 호출하는 자리
          }}
          onRetry={(entry) => simulateUpload(entry.id, updateEntryStatus)}
        />
      </AttachmentDisplayField>
    </VStack>
  );
}
