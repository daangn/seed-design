import { VStack, type AttachmentDisplayItemEntry } from "@seed-design/react";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const sampleEntries: AttachmentDisplayItemEntry[] = [
  {
    id: "1",
    thumbnailUrl: "https://picsum.photos/seed/readonly1/200/200",
    status: "success",
  },
  {
    id: "2",
    thumbnailUrl: "https://picsum.photos/seed/readonly2/200/200",
    status: "success",
  },
];

export default function AttachmentDisplayReadOnly() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField defaultEntries={sampleEntries} maxEntries={5} readOnly>
        <AttachmentDisplay onTriggerClick={() => {}} />
      </AttachmentDisplayField>
    </VStack>
  );
}
