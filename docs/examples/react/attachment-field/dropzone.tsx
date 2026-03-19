import { VStack } from "@seed-design/react";
import type { FileEntry } from "@seed-design/react/primitive";
import { AttachmentField, AttachmentInputDropzone } from "seed-design/ui/attachment-field";

const defaultAcceptedFileEntries: FileEntry[] = [
  {
    id: "1",
    file: new File(["hello"], "document.pdf", { type: "application/pdf" }),
    status: "success",
  },
];

export default function AttachmentInputDropzoneExample() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        maxFiles={5}
        label="파일 업로드"
        description="파일을 선택하거나 드래그 앤 드롭하세요"
        defaultAcceptedFileEntries={defaultAcceptedFileEntries}
      >
        <AttachmentInputDropzone />
      </AttachmentField>
    </VStack>
  );
}
