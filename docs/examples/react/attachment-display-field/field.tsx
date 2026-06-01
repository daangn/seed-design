"use client";

import { VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { useState } from "react";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const defaultEntries: DisplayItemEntry[] = [
  { id: "1", thumbnailUrl: "https://picsum.photos/seed/field1/200/200", status: "success" },
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

export default function AttachmentDisplayFieldExample() {
  const [entries, setEntries] = useState<DisplayItemEntry[]>(defaultEntries);
  const invalid = entries.length < 1;

  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField
        entries={entries}
        onEntriesChange={setEntries}
        maxEntries={5}
        invalid={invalid}
        label="프로필 사진"
        indicator="선택"
        description="최대 5장까지 첨부할 수 있어요"
        errorMessage="최소 1장은 첨부해야 해요"
        showRequiredIndicator
      >
        <AttachmentDisplay
          onTriggerClick={async ({ addEntries }) => {
            addEntries(await openMediaPicker());
          }}
        />
      </AttachmentDisplayField>
    </VStack>
  );
}
