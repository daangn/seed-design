import { VStack, type AttachmentInputFileEntry } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

const defaultFiles: AttachmentInputFileEntry[] = [
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

export default function AttachmentFieldReadOnly() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        readOnly
        maxFiles={5}
        defaultAcceptedFileEntries={defaultFiles}
        label="첨부 파일"
        description="읽기 전용 상태"
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
