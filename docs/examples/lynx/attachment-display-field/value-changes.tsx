import "@seed-design/lynx-css/base.css";

import { useRef, useState } from "@lynx-js/react";
import type { AttachmentDisplayEntry } from "@seed-design/lynx-react";
import { Text, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  AttachmentDisplay,
  AttachmentDisplayField,
} from "@/components/ui/attachment-display-field";

export default function AttachmentDisplayValueChanges() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [entries, setEntries] = useState<AttachmentDisplayEntry[]>([]);
  const entriesRef = useRef(entries);
  const [logs, setLogs] = useState<string[]>([]);
  const nextId = useRef(0);
  entriesRef.current = entries;

  const handleEntriesChange = (next: AttachmentDisplayEntry[]) => {
    const previous = entriesRef.current;
    const added = next.filter((entry) => !previous.some((oldEntry) => oldEntry.id === entry.id));
    const removed = previous.filter((entry) => !next.some((newEntry) => newEntry.id === entry.id));
    setLogs((current) => [
      ...current,
      ...(added.length > 0 ? [`added: ${added.map((entry) => entry.id).join(", ")}`] : []),
      ...(removed.length > 0 ? [`removed: ${removed.map((entry) => entry.id).join(", ")}`] : []),
    ]);
    entriesRef.current = next;
    setEntries(next);
  };

  return (
    <view className={seedClassName}>
      <VStack gap="x4" width="100%" align="center">
        <VStack gap="x1">
          {logs.length === 0 ? (
            <Text color="fg.neutralMuted">아이템을 추가하거나 삭제하면 로그가 표시됩니다.</Text>
          ) : null}
          {logs.map((log, index) => (
            <Text key={`${log}-${index}`}>{log}</Text>
          ))}
        </VStack>
        <AttachmentDisplayField
          entries={entries}
          onEntriesChange={handleEntriesChange}
          maxEntries={3}
        >
          <AttachmentDisplay
            onTriggerTap={({ addEntries }) => {
              // 문서 고정 fixture입니다. 실제 앱에서는 호스트 picker adapter가 반환한 entries를 전달하세요.
              const id = `value-change-${nextId.current++}`;
              addEntries([
                { id, thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`, status: "success" },
              ]);
            }}
          />
        </AttachmentDisplayField>
      </VStack>
    </view>
  );
}
