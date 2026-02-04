import { VStack } from "@seed-design/react";
import IconPlusLine from "@karrotmarket/react-monochrome-icon/IconPlusLine";
import {
  FileUpload,
  FileUploadContainer,
  FileUploadImageItem,
  FileUploadItemGroup,
  FileUploadTrigger,
} from "@/registry/ui/file-upload";

export default function FileUploadPreview() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUpload maxFiles={5} accept="image/*">
        <FileUploadContainer>
          <FileUploadTrigger>
            <IconPlusLine width={24} height={24} />
          </FileUploadTrigger>
          <FileUploadItemGroup>
            {({ acceptedFiles }) =>
              acceptedFiles.map((file) => <FileUploadImageItem key={file.name} file={file} />)
            }
          </FileUploadItemGroup>
        </FileUploadContainer>
      </FileUpload>
    </VStack>
  );
}
