import { VStack } from "@seed-design/react";
import type { FileEntry } from "@seed-design/react/primitive";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

const defaultAcceptedFileEntries: FileEntry[] = [
  {
    id: "1",
    file: new File(["hello"], "document.pdf", { type: "application/pdf" }),
    status: "success",
  },
];

export default function AttachmentFieldMaxFiles() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        maxFiles={3}
        label="파일 업로드"
        description="최대 3개까지 업로드할 수 있습니다"
        defaultAcceptedFileEntries={defaultAcceptedFileEntries}
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
