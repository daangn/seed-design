import { useCallback } from "react";
import { VStack } from "@seed-design/react";
import {
  FileUpload,
  FileUploadItem,
  type FileStatusDetails,
  type FileWithStatus,
} from "seed-design/ui/file-upload";

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
  const updateFile = useCallback(
    (
      file: File,
      details: FileStatusDetails,
      setAcceptedFiles: (fn: (prev: FileWithStatus[]) => FileWithStatus[]) => void,
    ) => {
      setAcceptedFiles((prev) => prev.map((f) => (f.file === file ? { file, details } : f)));
    },
    [],
  );

  const startUpload = useCallback(
    (file: File, setAcceptedFiles: (fn: (prev: FileWithStatus[]) => FileWithStatus[]) => void) => {
      // uploading 상태로 업데이트
      updateFile(file, { status: "uploading", progress: 0 }, setAcceptedFiles);

      // 업로드 시작
      uploadFile(file, (progress) => {
        updateFile(file, { status: "uploading", progress }, setAcceptedFiles);
      })
        .then(() => {
          // success 상태로 업데이트
          updateFile(file, { status: "success" }, setAcceptedFiles);
        })
        .catch(() => {
          // error 상태로 업데이트
          updateFile(file, { status: "error" }, setAcceptedFiles);
        });
    },
    [updateFile],
  );

  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUpload
        accept="image/*"
        maxFiles={5}
        label="파일 업로드"
        description="업로드 상태 시뮬레이션"
      >
        {({ acceptedFiles, setAcceptedFiles }) => {
          for (const { file, details } of acceptedFiles) {
            if (details.status !== "pending") continue;

            startUpload(file, setAcceptedFiles);
          }

          return acceptedFiles.map((fileWithStatus, index) => (
            <FileUploadItem
              key={`${fileWithStatus.file.name}-${index}`}
              fileWithStatus={fileWithStatus}
              onRetry={() => {
                setAcceptedFiles((prev) =>
                  prev.map((f) =>
                    f.file === fileWithStatus.file
                      ? { file: fileWithStatus.file, details: { status: "pending" } }
                      : f,
                  ),
                );
              }}
            />
          ));
        }}
      </FileUpload>
    </VStack>
  );
}
