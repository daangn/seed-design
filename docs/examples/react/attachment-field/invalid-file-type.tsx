import { useState } from "react";
import { VStack } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "INVALID_TYPE":
      return "지원하지 않는 파일 형식입니다";
    default:
      return "업로드에 실패했습니다";
  }
}

export default function AttachmentFieldInvalidFileType() {
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        accept={["image/png", "image/jpeg"]}
        maxFiles={3}
        invalid={!!errorMessage}
        errorMessage={errorMessage}
        label="이미지 업로드"
        description="PNG, JPEG 파일만 업로드할 수 있습니다"
        onAcceptedFileEntriesChange={() => setErrorMessage(undefined)}
        onFileReject={(files) => {
          const messages = files.map(
            ({ file, errors }) => `"${file.name}": ${errors.map(getErrorMessage).join(", ")}`,
          );
          setErrorMessage(messages.join("\n"));
        }}
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
