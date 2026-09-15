import "@seed-design/lynx-css/base.css";

import type { AttachmentDisplayEntry } from "@seed-design/lynx-react";
import { useRef } from "@lynx-js/react";
import {
  AttachmentDisplay,
  AttachmentDisplayField,
} from "@/components/ui/attachment-display-field";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
const FIXTURE_ENTRIES: AttachmentDisplayEntry[] = [
  {
    id: "fixture-1",
    thumbnailUrl: "https://picsum.photos/seed/seed1/200/200",
    status: "success",
  },
  {
    id: "fixture-2",
    thumbnailUrl: "https://picsum.photos/seed/seed2/200/200",
    status: "success",
  },
];

export default function AttachmentDisplayPreview() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const nextFixtureId = useRef(0);

  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentDisplayField defaultEntries={FIXTURE_ENTRIES} maxEntries={5}>
          <AttachmentDisplay
            onTriggerTap={({ addEntries }) => {
              // 문서 고정 fixture입니다. 실제 앱에서는 호스트 미디어 picker adapter를 전달하세요.
              const id = `fixture-added-${nextFixtureId.current++}`;
              addEntries([
                {
                  id,
                  thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
                  status: "success",
                },
              ]);
            }}
          />
        </AttachmentDisplayField>
      </VStack>
    </view>
  );
}
