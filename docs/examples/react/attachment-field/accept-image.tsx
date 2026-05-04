import { VStack } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

export default function AttachmentFieldAcceptImage() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        accept="image/*"
        maxFiles={5}
        label="이미지 업로드"
        description="이미지 파일만 허용됩니다"
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
