import { VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplayField, AttachmentDisplayInput } from "seed-design/ui/attachment-display";

const sampleItems: DisplayItemEntry[] = [
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
      <AttachmentDisplayField defaultItems={sampleItems} maxItems={5}>
        <AttachmentDisplayInput />
      </AttachmentDisplayField>
    </VStack>
  );
}
