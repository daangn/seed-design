"use client";

import { HStack, Text, VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

// 외부 미디어 피커 모킹. 실제 환경에서는 네이티브 브릿지/모달/서버 호출 등으로 교체하세요.
async function openMediaPicker(): Promise<DisplayItemEntry> {
  const id = crypto.randomUUID();
  return {
    id,
    thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
    status: "success",
  };
}

export default function AttachmentDisplayControlled() {
  const [entries, setEntries] = useState<DisplayItemEntry[]>([]);

  const handleTriggerClick = async () => {
    const newEntry = await openMediaPicker();
    setEntries((prev) => [...prev, newEntry]);
  };

  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField entries={entries} onEntriesChange={setEntries} maxEntries={5}>
        <AttachmentDisplay onTriggerClick={handleTriggerClick} />
      </AttachmentDisplayField>
      <Text>현재 아이템: {entries.length}개</Text>
      <HStack gap="x2">
        <ActionButton type="button" variant="neutralWeak" onClick={handleTriggerClick}>
          아이템 추가
        </ActionButton>
        <ActionButton type="button" variant="neutralWeak" onClick={() => setEntries([])}>
          전체 삭제
        </ActionButton>
      </HStack>
    </VStack>
  );
}
