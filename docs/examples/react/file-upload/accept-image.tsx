import { VStack } from "@seed-design/react";
import { FileUploadField, FileUpload } from "seed-design/ui/file-upload";

export default function FileUploadAcceptImage() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUploadField
        accept="image/*"
        maxFiles={5}
        label="이미지 업로드"
        description="이미지 파일만 허용됩니다"
      >
        <FileUpload />
      </FileUploadField>
    </VStack>
  );
}
