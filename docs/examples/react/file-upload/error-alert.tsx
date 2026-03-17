import { useRef } from "react";
import { VStack } from "@seed-design/react";
import { FileUploadField, FileUpload, FileUploadItem } from "seed-design/ui/file-upload";

export default function FileUploadErrorAlert() {
  const processedRef = useRef<Set<File>>(new Set());
  const alertedRef = useRef<Set<File>>(new Set());

  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUploadField
        maxFiles={5}
        label="파일 업로드"
        description="2번째 파일은 업로드에 실패합니다"
      >
        <FileUpload>
          {({ acceptedFiles, updateFileStatus }) => {
            for (const { file, details } of acceptedFiles) {
              if (details.status === "pending" && !processedRef.current.has(file)) {
                processedRef.current.add(file);
                const fileIndex = acceptedFiles.findIndex((f) => f.file === file);
                const shouldFail = fileIndex === 1;

                updateFileStatus(file, shouldFail ? { status: "error" } : { status: "success" });
              }
            }

            for (const file of processedRef.current) {
              if (!acceptedFiles.some((f) => f.file === file)) {
                processedRef.current.delete(file);
                alertedRef.current.delete(file);
              }
            }

            for (const { file, details } of acceptedFiles) {
              if (details.status === "error" && !alertedRef.current.has(file)) {
                alertedRef.current.add(file);
                window.alert(`업로드에 실패했습니다: ${file.name}`);
              }
            }

            return acceptedFiles.map((fileWithStatus, index) => (
              <FileUploadItem
                key={`${fileWithStatus.file.name}-${index}`}
                fileWithStatus={fileWithStatus}
                onRetry={() => {
                  alertedRef.current.delete(fileWithStatus.file);
                  processedRef.current.delete(fileWithStatus.file);
                  updateFileStatus(fileWithStatus.file, { status: "pending" });
                }}
              />
            ));
          }}
        </FileUpload>
      </FileUploadField>
    </VStack>
  );
}
