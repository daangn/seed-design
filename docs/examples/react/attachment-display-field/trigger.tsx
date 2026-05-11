import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const defaultEntries: DisplayItemEntry[] = [
  {
    id: "1",
    thumbnailUrl: "https://picsum.photos/seed/trigger1/200/200",
    status: "success",
  },
];

export default function AttachmentDisplayTrigger() {
  return (
    <AttachmentDisplayField defaultEntries={defaultEntries} maxEntries={3}>
      <AttachmentDisplay
        onTriggerClick={() => {
          // 외부 미디어 피커 호출 자리
        }}
      />
    </AttachmentDisplayField>
  );
}
