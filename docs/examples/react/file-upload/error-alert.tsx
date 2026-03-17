import { useRef } from "react";
import { VStack } from "@seed-design/react";
import { FileUploadField, FileUpload, FileUploadItem } from "seed-design/ui/file-upload";

export default function FileUploadErrorAlert() {
  const processedRef = useRef<Set<string>>(new Set());
  const alertedRef = useRef<Set<string>>(new Set());

  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUploadField
        maxFiles={5}
        label="파일 업로드"
        description="2번째 파일은 업로드에 실패합니다"
      >
        <FileUpload>
          {({ acceptedFiles, updateFileStatus }) => {
            for (const fileEntry of acceptedFiles) {
              if (fileEntry.status === "pending" && !processedRef.current.has(fileEntry.id)) {
                processedRef.current.add(fileEntry.id);
                const fileIndex = acceptedFiles.findIndex((f) => f.id === fileEntry.id);
                const shouldFail = fileIndex === 1;

                updateFileStatus(
                  fileEntry.id,
                  shouldFail ? { status: "error" } : { status: "success" },
                );
              }
            }

            for (const id of processedRef.current) {
              if (!acceptedFiles.some((f) => f.id === id)) {
                processedRef.current.delete(id);
                alertedRef.current.delete(id);
              }
            }

            for (const fileEntry of acceptedFiles) {
              if (fileEntry.status === "error" && !alertedRef.current.has(fileEntry.id)) {
                alertedRef.current.add(fileEntry.id);
                window.alert(`업로드에 실패했습니다: ${fileEntry.file.name}`);
              }
            }

            return acceptedFiles.map((fileEntry) => (
              <FileUploadItem
                key={fileEntry.id}
                fileEntry={fileEntry}
                onRetry={() => {
                  alertedRef.current.delete(fileEntry.id);
                  processedRef.current.delete(fileEntry.id);
                  updateFileStatus(fileEntry.id, { status: "pending" });
                }}
              />
            ));
          }}
        </FileUpload>
      </FileUploadField>
    </VStack>
  );
}
