import { useCallback } from "react";
import { VStack } from "@seed-design/react";
import { FileUpload, FileUploadItem, type FileStatusDetails } from "seed-design/ui/file-upload";

// 실제 환경에서는 fetch 등으로 교체하세요.
async function uploadFile(
  file: File,
  onProgress: (progress: number) => void,
): Promise<{ url: string }> {
  const totalChunks = 5;
  for (let i = 1; i <= totalChunks; i++) {
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
    onProgress(Math.round((i / totalChunks) * 100));
  }

  if (Math.random() > 0.5) {
    throw new Error("Network error");
  }

  return { url: `https://example.com/uploads/${file.name}` };
}

export default function FileUploadStates() {
  const startUpload = useCallback(
    (file: File, updateFileStatus: (file: File, details: FileStatusDetails) => void) => {
      updateFileStatus(file, { status: "uploading", progress: 0 });

      uploadFile(file, (progress) => {
        updateFileStatus(file, { status: "uploading", progress });
      })
        .then(() => updateFileStatus(file, { status: "success" }))
        .catch(() => updateFileStatus(file, { status: "error" }));
    },
    [],
  );

  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUpload
        accept="image/*"
        maxFiles={5}
        label="파일 업로드"
        description="업로드 상태 시뮬레이션"
      >
        {({ acceptedFiles, updateFileStatus }) => {
          for (const { file, details } of acceptedFiles) {
            if (details.status !== "pending") continue;

            startUpload(file, updateFileStatus);
          }

          return acceptedFiles.map((fileWithStatus, index) => (
            <FileUploadItem
              key={`${fileWithStatus.file.name}-${index}`}
              fileWithStatus={fileWithStatus}
              onRetry={() => updateFileStatus(fileWithStatus.file, { status: "pending" })}
            />
          ));
        }}
      </FileUpload>
    </VStack>
  );
}
