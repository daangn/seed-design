import "@seed-design/lynx-css/base.css";

import { useRef, useState } from "@lynx-js/react";
import type { AttachmentDisplayEntry } from "@seed-design/lynx-react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  AttachmentDisplay,
  AttachmentDisplayField,
} from "@/components/ui/attachment-display-field";

const INITIAL_ENTRY: AttachmentDisplayEntry = {
  id: "field-1",
  thumbnailUrl: "https://picsum.photos/seed/field1/200/200",
  status: "success",
};

export default function AttachmentDisplayFieldExample() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [entries, setEntries] = useState<AttachmentDisplayEntry[]>([INITIAL_ENTRY]);
  const nextId = useRef(0);
  const invalid = entries.length < 1;

  return (
    <view className={seedClassName}>
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
            onTriggerTap={({ addEntries }) => {
              // 문서 고정 fixture입니다. 실제 앱에서는 호스트 picker 결과를 전달하세요.
              const id = `field-added-${nextId.current++}`;
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
