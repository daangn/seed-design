import { VStack, Text } from "@seed-design/react";
import { useState } from "react";
import type { FileStatusDetails } from "@seed-design/react/primitive";
import { FileUploadField, FileUpload, FileUploadItem } from "seed-design/ui/file-upload";

function simulateUpload(
  file: File,
  id: string,
  updateFileStatus: (id: string, details: FileStatusDetails) => void,
) {
  updateFileStatus(id, { status: "uploading", progress: 0 });

  let progress = 0;
  const interval = setInterval(() => {
    progress += 25;
    if (progress >= 100) {
      clearInterval(interval);
      updateFileStatus(id, { status: "success" });
    } else {
      updateFileStatus(id, { status: "uploading", progress });
    }
  }, 500);
}

export default function FileUploadValueChanges() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  return (
    <VStack gap="x4" width="100%">
      <FileUploadField
        maxFiles={3}
        label="파일 업로드"
        description="콜백 호출 로그를 확인하세요"
        onAcceptedFilesChange={(files) => {
          addLog(
            `onAcceptedFilesChange: ${files.map((f) => `${f.file.name} (${f.status})`).join(", ")}`,
          );
        }}
        onFileReject={(files) => {
          addLog(
            `onFileReject: ${files.map((f) => `${f.file.name} (${f.errors.join(", ")})`).join(", ")}`,
          );
        }}
      >
        <FileUpload>
          {({ acceptedFiles, updateFileStatus }) => {
            for (const fileEntry of acceptedFiles) {
              if (fileEntry.status !== "pending") continue;

              simulateUpload(fileEntry.file, fileEntry.id, updateFileStatus);
            }

            return acceptedFiles.map((fileEntry) => (
              <FileUploadItem key={fileEntry.id} fileEntry={fileEntry} />
            ));
          }}
        </FileUpload>
      </FileUploadField>
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
