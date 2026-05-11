"use client";

import { Text, VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { useRef, useState } from "react";
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

export default function AttachmentDisplayValueChanges() {
  const [entries, setEntries] = useState<DisplayItemEntry[]>([]);
  const entriesRef = useRef(entries);
  const [logs, setLogs] = useState<string[]>([]);

  entriesRef.current = entries;

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleTriggerClick = async () => {
    const newEntry = await openMediaPicker();
    setEntries((prev) => [...prev, newEntry]);
    addLog(`added: ${newEntry.id}`);
  };

  const handleEntriesChange = (next: DisplayItemEntry[]) => {
    const prev = entriesRef.current;
    const removed = prev.filter((p) => !next.some((n) => n.id === p.id));
    if (removed.length > 0) addLog(`removed: ${removed.map((r) => r.id).join(", ")}`);
    setEntries(next);
  };

  return (
    <VStack gap="x4" width="100%" alignItems="center">
      <VStack gap="x1">
        {logs.length === 0 ? (
          <Text color="fg.neutralMuted">아이템을 추가하거나 삭제하면 로그가 표시됩니다.</Text>
        ) : (
          logs.map((log, index) => (
            <Text key={index} fontSize="fontSize.caption1">
              {log}
            </Text>
          ))
        )}
      </VStack>
      <AttachmentDisplayField
        entries={entries}
        onEntriesChange={handleEntriesChange}
        maxEntries={3}
      >
        <AttachmentDisplay onTriggerClick={handleTriggerClick} />
      </AttachmentDisplayField>
    </VStack>
  );
}
