import { VStack, Text } from "@seed-design/react";
import { useState } from "react";
import type { FileStatusDetails } from "@seed-design/react/primitive";
import {
  AttachmentField,
  AttachmentInput,
  AttachmentInputItem,
} from "seed-design/ui/attachment-field";

function simulateUpload(
  _file: File,
  id: string,
  updateFileEntryStatus: (id: string, details: FileStatusDetails) => void,
) {
  updateFileEntryStatus(id, { status: "uploading", progress: 0 });

  let progress = 0;
  const interval = setInterval(() => {
    progress += 25;
    if (progress >= 100) {
      clearInterval(interval);
      updateFileEntryStatus(id, { status: "success" });
    } else {
      updateFileEntryStatus(id, { status: "uploading", progress });
    }
  }, 500);
}

export default function AttachmentInputValueChanges() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  return (
    <VStack gap="x4" width="100%" alignItems="center">
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
      <AttachmentField
        maxFiles={3}
        label="파일 업로드"
        description="콜백 호출 로그를 확인하세요"
        onAcceptedFileEntriesChange={(files) => {
          addLog(
            `onAcceptedFileEntriesChange: ${files.map((f) => `${f.file.name} (${f.status})`).join(", ")}`,
          );
        }}
        onFileReject={(files) => {
          addLog(
            `onFileReject: ${files.map((f) => `${f.file.name} (${f.errors.join(", ")})`).join(", ")}`,
          );
        }}
      >
        <AttachmentInput>
          {({ acceptedFileEntries, updateFileEntryStatus }) => {
            for (const fileEntry of acceptedFileEntries) {
              if (fileEntry.status !== "pending") continue;

              simulateUpload(fileEntry.file, fileEntry.id, updateFileEntryStatus);
            }

            return acceptedFileEntries.map((fileEntry) => (
              <AttachmentInputItem key={fileEntry.id} fileEntry={fileEntry} />
            ));
          }}
        </AttachmentInput>
      </AttachmentField>
    </VStack>
  );
}
