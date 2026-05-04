import { VStack } from "@seed-design/react";
import type { FileEntry } from "@seed-design/react/primitive";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

const defaultFiles: FileEntry[] = [
  {
    id: "mock-1",
    file: new File(["hello"], "document.pdf", { type: "application/pdf" }),
    status: "success",
  },
  {
    id: "mock-2",
    file: new File(["world"], "image.png", { type: "image/png" }),
    status: "success",
  },
];

export default function AttachmentFieldDisabled() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        disabled
        maxFiles={5}
        defaultAcceptedFileEntries={defaultFiles}
        label="파일 업로드"
        description="비활성화된 AttachmentField"
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
