import { VStack } from "@seed-design/react";
import {
  FileUpload,
  FileUploadContainer,
  FileUploadTrigger,
  FileUploadItemGroup,
  FileUploadItem,
} from "seed-design/ui/file-upload";

export default function FileUploadMaxFiles() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUpload maxFiles={3} label="파일 업로드" description="최대 3개까지 업로드할 수 있습니다">
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
    </VStack>
  );
}
