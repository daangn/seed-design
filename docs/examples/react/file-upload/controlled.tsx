import { VStack, HStack, Text } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  FileUpload,
  FileUploadContainer,
  FileUploadTrigger,
  FileUploadItemGroup,
  FileUploadItem,
  type FileWithStatus,
} from "seed-design/ui/file-upload";

export default function FileUploadControlled() {
  const [acceptedFiles, setAcceptedFiles] = useState<FileWithStatus[]>([]);

  return (
    <VStack gap="x4" width="100%">
      <FileUpload
        maxFiles={5}
        label="Controlled"
        description="최대 5개까지 업로드할 수 있습니다"
        acceptedFiles={acceptedFiles}
        onAcceptedFilesChange={setAcceptedFiles}
      >
        <FileUploadContainer>
          <FileUploadTrigger />
          <FileUploadItemGroup>
            {({ acceptedFiles }) =>
              acceptedFiles.map((fileWithStatus, index) => (
                <FileUploadItem
                  key={`${fileWithStatus.file.name}-${index}`}
                  fileWithStatus={fileWithStatus}
                />
              ))
            }
          </FileUploadItemGroup>
        </FileUploadContainer>
      </FileUpload>
      <Text>현재 파일: {JSON.stringify(acceptedFiles.map((f) => f.file.name))}</Text>
      <HStack gap="x2">
        <ActionButton type="button" variant="neutralWeak" onClick={() => setAcceptedFiles([])}>
          전체 삭제
        </ActionButton>
      </HStack>
    </VStack>
  );
}
