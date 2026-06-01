import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const defaultEntries: DisplayItemEntry[] = [
  {
    id: "1",
    thumbnailUrl: "https://picsum.photos/seed/trigger1/200/200",
    status: "success",
  },
];

// 외부 미디어 피커 모킹. 실제 환경에서는 네이티브 브릿지/모달/서버 호출 등으로 교체하세요.
async function openMediaPicker(): Promise<DisplayItemEntry[]> {
  const id = crypto.randomUUID();
  return [
    {
      id,
      thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
      status: "success",
    },
  ];
}

export default function AttachmentDisplayTrigger() {
  return (
    <AttachmentDisplayField defaultEntries={defaultEntries} maxEntries={3}>
      <AttachmentDisplay
        onTriggerClick={async ({ addEntries }) => {
          addEntries(await openMediaPicker());
        }}
      />
    </AttachmentDisplayField>
  );
}
