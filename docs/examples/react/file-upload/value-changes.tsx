import { VStack, Text } from "@seed-design/react";
import { useCallback, useState } from "react";
import {
  FileUpload,
  FileUploadContainer,
  FileUploadTrigger,
  FileUploadItemGroup,
  FileUploadItem,
  type FileWithStatus,
  type FileStatusDetails,
} from "seed-design/ui/file-upload";

function simulateUpload(file: File, updateFile: (file: File, details: FileStatusDetails) => void) {
  updateFile(file, { status: "uploading", progress: 0 });

  let progress = 0;
  const interval = setInterval(() => {
    progress += 25;
    if (progress >= 100) {
      clearInterval(interval);
      updateFile(file, { status: "success" });
    } else {
      updateFile(file, { status: "uploading", progress });
    }
  }, 500);
}

export default function FileUploadValueChanges() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

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

  return (
    <VStack gap="x4" width="100%">
      <FileUpload
        maxFiles={3}
        label="파일 업로드"
        description="콜백 호출 로그를 확인하세요"
        onAcceptedFilesChange={(files) => {
          addLog(
            `onAcceptedFilesChange: ${files.map((f) => `${f.file.name} (${f.details.status})`).join(", ")}`,
          );
        }}
        onFileReject={({ files }) => {
          addLog(
            `onFileReject: ${files.map((f) => `${f.file.name} (${f.errors.join(", ")})`).join(", ")}`,
          );
        }}
      >
        <FileUploadContainer>
          <FileUploadTrigger />
          <FileUploadItemGroup>
            {({ acceptedFiles, setAcceptedFiles }) => {
              for (const { file, details } of acceptedFiles) {
                if (details.status !== "pending") continue;

                simulateUpload(file, (f, d) => updateFile(f, d, setAcceptedFiles));
              }

              return acceptedFiles.map((fileWithStatus, index) => (
                <FileUploadItem
                  key={`${fileWithStatus.file.name}-${index}`}
                  fileWithStatus={fileWithStatus}
                />
              ));
            }}
          </FileUploadItemGroup>
        </FileUploadContainer>
      </FileUpload>
      <VStack gap="x1">
        {logs.length === 0 ? (
          <Text color="fg.neutralMuted">파일을 추가하거나 삭제하면 로그가 표시됩니다.</Text>
        ) : (
          logs.map((log, index) => (
            <Text key={index} fontSize="fontSize.caption1">
              {log}
            </Text>
          ))
        )}
      </VStack>
    </VStack>
  );
}
