import { useCallback } from "react";
import { VStack } from "@seed-design/react";
import type { FileStatusDetails } from "@seed-design/react/primitive";
import { FileUploadField, FileUpload, FileUploadItem } from "seed-design/ui/file-upload";

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
    (
      file: File,
      id: string,
      updateFileStatus: (id: string, details: FileStatusDetails) => void,
    ) => {
      updateFileStatus(id, { status: "uploading", progress: 0 });

      uploadFile(file, (progress) => {
        updateFileStatus(id, { status: "uploading", progress });
      })
        .then(() => updateFileStatus(id, { status: "success" }))
        .catch(() => updateFileStatus(id, { status: "error" }));
    },
    [],
  );

  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUploadField
        accept="image/*"
        maxFiles={5}
        label="파일 업로드"
        description="업로드 상태 시뮬레이션"
      >
        <FileUpload>
          {({ acceptedFiles, updateFileStatus }) => {
            for (const fileEntry of acceptedFiles) {
              if (fileEntry.status !== "pending") continue;

              startUpload(fileEntry.file, fileEntry.id, updateFileStatus);
            }

            return acceptedFiles.map((fileEntry) => (
              <FileUploadItem
                key={fileEntry.id}
                fileEntry={fileEntry}
                onRetry={() => updateFileStatus(fileEntry.id, { status: "pending" })}
              />
            ));
          }}
        </FileUpload>
      </FileUploadField>
    </VStack>
  );
}
