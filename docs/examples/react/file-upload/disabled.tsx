import { VStack } from "@seed-design/react";
import { FileUpload, type FileWithStatus } from "seed-design/ui/file-upload";

const defaultFiles: FileWithStatus[] = [
  {
    file: new File(["hello"], "document.pdf", { type: "application/pdf" }),
    details: { status: "success" },
  },
  {
    file: new File(["world"], "image.png", { type: "image/png" }),
    details: { status: "success" },
  },
];

export default function FileUploadDisabled() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUpload
        disabled
        maxFiles={5}
        defaultAcceptedFiles={defaultFiles}
        label="파일 업로드"
        description="현재 파일을 업로드할 수 없습니다"
      />
    </VStack>
  );
}
