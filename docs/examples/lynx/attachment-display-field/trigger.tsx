import "@seed-design/lynx-css/base.css";

import { useRef } from "@lynx-js/react";
import type { AttachmentDisplayEntry } from "@seed-design/lynx-react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  AttachmentDisplay,
  AttachmentDisplayField,
} from "@/components/ui/attachment-display-field";

const INITIAL_ENTRY: AttachmentDisplayEntry = {
  id: "trigger-1",
  thumbnailUrl: "https://picsum.photos/seed/trigger1/200/200",
  status: "success",
};

export default function AttachmentDisplayTrigger() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const nextId = useRef(0);

  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentDisplayField defaultEntries={[INITIAL_ENTRY]} maxEntries={3}>
          <AttachmentDisplay
            onTriggerTap={({ addEntries }) => {
              // 문서 고정 fixture입니다. 실제 앱에서는 호스트 media picker 결과를 전달하세요.
              const id = `trigger-added-${nextId.current++}`;
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
