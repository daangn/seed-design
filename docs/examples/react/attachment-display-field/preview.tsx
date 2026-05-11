import { VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const sampleEntries: DisplayItemEntry[] = [
  {
    id: "1",
    thumbnailUrl: "https://picsum.photos/seed/seed1/200/200",
    status: "success",
  },
  {
    id: "2",
    thumbnailUrl: "https://picsum.photos/seed/seed2/200/200",
    status: "success",
  },
];

export default function AttachmentDisplayPreview() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField defaultEntries={sampleEntries} maxEntries={5}>
        <AttachmentDisplay
          onTriggerClick={() => {
            // 외부 미디어 피커를 호출하는 자리
            alert("미디어 피커 열기");
          }}
        />
      </AttachmentDisplayField>
    </VStack>
  );
}
