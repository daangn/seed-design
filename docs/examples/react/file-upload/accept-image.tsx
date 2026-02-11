import { VStack } from "@seed-design/react";
import {
  FileUpload,
  FileUploadContainer,
  FileUploadTrigger,
  FileUploadItemGroup,
  FileUploadItem,
} from "seed-design/ui/file-upload";

export default function FileUploadAcceptImage() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUpload
        accept="image/*"
        maxFiles={5}
        label="이미지 업로드"
        description="이미지 파일만 허용됩니다"
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
    </VStack>
  );
}
