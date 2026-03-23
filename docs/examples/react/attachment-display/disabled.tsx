import { VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplayField, AttachmentDisplayInput } from "seed-design/ui/attachment-display";

const sampleItems: DisplayItemEntry[] = [
  {
    id: "1",
    thumbnailUrl: "https://picsum.photos/seed/dis1/200/200",
    status: "success",
  },
];

export default function AttachmentDisplayDisabled() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField disabled defaultItems={sampleItems} maxItems={3}>
        <AttachmentDisplayInput />
      </AttachmentDisplayField>
    </VStack>
  );
}
