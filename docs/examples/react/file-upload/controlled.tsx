import { VStack, HStack, Text } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import type { FileWithStatus } from "@seed-design/react/primitive";
import { FileUploadField, FileUpload } from "seed-design/ui/file-upload";

export default function FileUploadControlled() {
  const [acceptedFiles, setAcceptedFiles] = useState<FileWithStatus[]>([]);

  return (
    <VStack gap="x4" width="100%">
      <FileUploadField
        maxFiles={5}
        label="Controlled"
        description="최대 5개까지 업로드할 수 있습니다"
        acceptedFiles={acceptedFiles}
        onAcceptedFilesChange={setAcceptedFiles}
      >
        <FileUpload />
      </FileUploadField>
      <Text>현재 파일: {JSON.stringify(acceptedFiles.map((f) => f.file.name))}</Text>
      <HStack gap="x2">
        <ActionButton type="button" variant="neutralWeak" onClick={() => setAcceptedFiles([])}>
          전체 삭제
        </ActionButton>
      </HStack>
    </VStack>
  );
}
