import { VStack } from "@seed-design/react";
import type { FileEntry } from "@seed-design/react/primitive";
import { FileUploadField, FileUpload } from "seed-design/ui/file-upload";

const defaultAcceptedFileEntries: FileEntry[] = [
  {
    id: "1",
    file: new File(["hello"], "document.pdf", { type: "application/pdf" }),
    status: "success",
  },
];

export default function FileUploadMaxFiles() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUploadField
        maxFiles={3}
        label="파일 업로드"
        description="최대 3개까지 업로드할 수 있습니다"
        defaultAcceptedFileEntries={defaultAcceptedFileEntries}
      >
        <FileUpload />
      </FileUploadField>
    </VStack>
  );
}
