import { VStack, type AttachmentDisplayItemEntry } from "@seed-design/react";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const sampleEntries: AttachmentDisplayItemEntry[] = [
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

// 외부 미디어 피커 모킹. 실제 환경에서는 네이티브 브릿지/모달/서버 호출 등으로 교체하세요.
async function openMediaPicker(): Promise<AttachmentDisplayItemEntry[]> {
  const id = crypto.randomUUID();
  return [
    {
      id,
      thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
      status: "success",
    },
  ];
}

export default function AttachmentDisplayPreview() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField defaultEntries={sampleEntries} maxEntries={5}>
        <AttachmentDisplay
          onTriggerClick={async ({ addEntries }) => {
            addEntries(await openMediaPicker());
          }}
        />
      </AttachmentDisplayField>
    </VStack>
  );
}
