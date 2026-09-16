import "@seed-design/lynx-css/base.css";

import { useRef, useState } from "@lynx-js/react";
import type { AttachmentDisplayEntry } from "@seed-design/lynx-react";
import { ActionButton, HStack, Text, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  AttachmentDisplay,
  AttachmentDisplayField,
} from "@/components/ui/attachment-display-field";

export default function AttachmentDisplayControlled() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [entries, setEntries] = useState<AttachmentDisplayEntry[]>([]);
  const nextId = useRef(0);

  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentDisplayField entries={entries} onEntriesChange={setEntries} maxEntries={5}>
          <AttachmentDisplay
            onTriggerTap={({ addEntries }) => {
              // 문서 고정 fixture입니다. 실제 앱에서는 호스트 picker 결과를 전달하세요.
              const id = `controlled-${nextId.current++}`;
              addEntries([
                { id, thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`, status: "success" },
              ]);
            }}
          />
        </AttachmentDisplayField>
        <Text>현재 아이템: {entries.length}개</Text>
        <HStack gap="x2">
          <ActionButton bindtap={() => setEntries([])}>전체 삭제</ActionButton>
        </HStack>
      </VStack>
    </view>
  );
}
