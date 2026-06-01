"use client";

import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { useState } from "react";
import { AttachmentDisplayField } from "seed-design/ui/attachment-display-field";
import { AttachmentDisplayReorderable } from "seed-design/ui/attachment-display-field-reorderable";

const defaultEntries: DisplayItemEntry[] = [
  { id: "1", thumbnailUrl: "https://picsum.photos/seed/reorder1/200/200", status: "success" },
  { id: "2", thumbnailUrl: "https://picsum.photos/seed/reorder2/200/200", status: "success" },
  { id: "3", thumbnailUrl: "https://picsum.photos/seed/reorder3/200/200", status: "success" },
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

export default function AttachmentDisplayReorderableExample() {
  const [entries, setEntries] = useState<DisplayItemEntry[]>(defaultEntries);

  return (
    <AttachmentDisplayField entries={entries} onEntriesChange={setEntries} maxEntries={5}>
      <AttachmentDisplayReorderable
        onTriggerClick={async ({ addEntries }) => {
          addEntries(await openMediaPicker());
        }}
      />
    </AttachmentDisplayField>
  );
}
