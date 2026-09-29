import { VStack, type AttachmentDisplayItemEntry } from "@seed-design/react";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const sampleEntries: AttachmentDisplayItemEntry[] = [
  {
    id: "1",
    thumbnailUrl: "https://picsum.photos/seed/disabled1/200/200",
    status: "success",
  },
];

export default function AttachmentDisplayDisabled() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField defaultEntries={sampleEntries} maxEntries={5} disabled>
        <AttachmentDisplay onTriggerClick={() => {}} />
      </AttachmentDisplayField>
    </VStack>
  );
}
