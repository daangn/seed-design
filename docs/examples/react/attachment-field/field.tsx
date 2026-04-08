import { Divider, VStack } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

export default function AttachmentFieldField() {
  return (
    <VStack gap="x8" width="100%">
      <AttachmentField
        maxFiles={3}
        label="첨부파일"
        labelWeight="bold"
        required
        showRequiredIndicator
        invalid
        errorMessage="필수 항목입니다."
      >
        <AttachmentInput />
      </AttachmentField>
      <Divider />
      <AttachmentField
        maxFiles={3}
        label="첨부파일"
        description="파일을 선택하거나 드래그 앤 드롭하세요."
        indicator="선택"
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
