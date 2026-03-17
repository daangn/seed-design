import { VStack, HStack, Text } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import type { FileEntry } from "@seed-design/react/primitive";
import { FileUploadField, FileUpload } from "seed-design/ui/file-upload";

export default function FileUploadControlled() {
  const [acceptedFileEntries, setAcceptedFileEntries] = useState<FileEntry[]>([]);

  return (
    <VStack gap="x4" width="100%">
      <FileUploadField
        maxFiles={5}
        label="Controlled"
        description="최대 5개까지 업로드할 수 있습니다"
        acceptedFileEntries={acceptedFileEntries}
        onAcceptedFileEntriesChange={setAcceptedFileEntries}
      >
        <FileUpload />
      </FileUploadField>
      <Text>현재 파일: {JSON.stringify(acceptedFileEntries.map((f) => f.file.name))}</Text>
      <HStack gap="x2">
        <ActionButton
          type="button"
          variant="neutralWeak"
          onClick={() => setAcceptedFileEntries([])}
        >
          전체 삭제
        </ActionButton>
      </HStack>
    </VStack>
  );
}
