import { useState, useCallback } from "react";
import { VStack } from "@seed-design/react";
import type { DisplayItemEntry, DisplayItemStatusDetails } from "@seed-design/react/primitive";
import {
  AttachmentDisplayField,
  AttachmentDisplayInput,
  AttachmentDisplayItem,
} from "seed-design/ui/attachment-display";

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
      if (Math.random() > 0.5) {
        updateStatus(id, { status: "success" });
      } else {
        updateStatus(id, { status: "error" });
      }
    } else {
      updateStatus(id, { status: "uploading", progress });
    }
  }, 300);
}

export default function AttachmentDisplayStatus() {
  const [items, setItems] = useState<DisplayItemEntry[]>([
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

  const updateItemStatus = useCallback((id: string, details: DisplayItemStatusDetails) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...details } : item)));
  }, []);

  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField items={items} onItemsChange={setItems} maxItems={5}>
        <AttachmentDisplayInput>
          {({ items: displayItems }) =>
            displayItems.map((entry) => (
              <AttachmentDisplayItem
                key={entry.id}
                entry={entry}
                onRetry={() => simulateUpload(entry.id, updateItemStatus)}
              />
            ))
          }
        </AttachmentDisplayInput>
      </AttachmentDisplayField>
    </VStack>
  );
}
