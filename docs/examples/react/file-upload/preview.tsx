import { VStack } from "@seed-design/react";
import { FileUploadField, FileUpload } from "seed-design/ui/file-upload";

export default function FileUploadPreview() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUploadField
        maxFiles={3}
        label="파일 업로드"
        description="최대 3개까지 업로드할 수 있습니다"
      >
        <FileUpload />
      </FileUploadField>
    </VStack>
  );
}
