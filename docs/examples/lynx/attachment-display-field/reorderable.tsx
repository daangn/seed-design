import { useRef, useState } from "@lynx-js/react";
import { VStack } from "@seed-design/lynx-react";
import type { AttachmentDisplayEntry } from "@seed-design/lynx-react";
import { AttachmentDisplayField } from "@/components/ui/attachment-display-field";
import { AttachmentDisplayReorderable } from "@/components/ui/attachment-display-field-reorderable";

const INITIAL_ENTRIES: AttachmentDisplayEntry[] = [
  {
    id: "reorder-1",
    thumbnailUrl: "https://picsum.photos/seed/reorder1/200/200",
    status: "success",
  },
  {
    id: "reorder-2",
    thumbnailUrl: "https://picsum.photos/seed/reorder2/200/200",
    status: "success",
  },
  {
    id: "reorder-3",
    thumbnailUrl: "https://picsum.photos/seed/reorder3/200/200",
    status: "success",
  },
];

export default function AttachmentDisplayReorderableExample() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const nextId = useRef(0);
  return (
    <VStack width="100%">
      <AttachmentDisplayField entries={entries} onEntriesChange={setEntries} maxEntries={5}>
        <AttachmentDisplayReorderable
          onTriggerTap={({ addEntries }) => {
            // 문서 고정 fixture입니다. 실제 앱에서는 호스트 picker 결과를 전달하세요.
            const id = `reorder-added-${nextId.current++}`;
            addEntries([
              { id, thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`, status: "success" },
            ]);
          }}
        />
      </AttachmentDisplayField>
    </VStack>
  );
}
