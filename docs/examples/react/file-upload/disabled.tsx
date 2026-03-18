import { VStack } from "@seed-design/react";
import type { FileEntry } from "@seed-design/react/primitive";
import { FileUploadField, FileUpload } from "seed-design/ui/file-upload";

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

export default function FileUploadDisabled() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUploadField
        disabled
        maxFiles={5}
        defaultAcceptedFileEntries={defaultFiles}
        label="파일 업로드"
        description="비활성화된 FileUploadField"
      >
        <FileUpload />
      </FileUploadField>
    </VStack>
  );
}
