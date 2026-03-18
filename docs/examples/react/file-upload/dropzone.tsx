import { VStack } from "@seed-design/react";
import { FileUploadField, FileUploadDropzone } from "seed-design/ui/file-upload";

export default function FileUploadDropzoneExample() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUploadField
        maxFiles={5}
        label="파일 업로드"
        description="파일을 선택하거나 드래그 앤 드롭하세요"
      >
        <FileUploadDropzone />
      </FileUploadField>
    </VStack>
  );
}
