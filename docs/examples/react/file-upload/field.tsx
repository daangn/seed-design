import { Divider, VStack } from "@seed-design/react";
import {
  FileUpload,
  FileUploadContainer,
  FileUploadTrigger,
  FileUploadItemGroup,
  FileUploadItem,
} from "seed-design/ui/file-upload";

export default function FileUploadField() {
  return (
    <VStack gap="x8" width="100%">
      <FileUpload
        maxFiles={3}
        label="첨부파일"
        labelWeight="bold"
        description="파일을 선택하거나 드래그 앤 드롭하세요."
        indicator="선택"
        required
        showRequiredIndicator
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
      <Divider />
      <FileUpload
        maxFiles={3}
        label="첨부파일"
        description="파일을 선택하거나 드래그 앤 드롭하세요."
        invalid
        errorMessage="필수 항목입니다."
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
