import { Divider, VStack } from "@seed-design/react";
import { FileUploadField, FileUpload } from "seed-design/ui/file-upload";

export default function FileUploadField_() {
  return (
    <VStack gap="x8" width="100%">
      <FileUploadField
        maxFiles={3}
        label="첨부파일"
        labelWeight="bold"
        description="파일을 선택하거나 드래그 앤 드롭하세요."
        indicator="선택"
        required
        showRequiredIndicator
      >
        <FileUpload />
      </FileUploadField>
      <Divider />
      <FileUploadField
        maxFiles={3}
        label="첨부파일"
        description="파일을 선택하거나 드래그 앤 드롭하세요."
        invalid
        errorMessage="필수 항목입니다."
      >
        <FileUpload />
      </FileUploadField>
    </VStack>
  );
}
