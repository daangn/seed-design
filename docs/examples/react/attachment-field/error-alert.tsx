import { useCallback, useRef } from "react";
import { VStack } from "@seed-design/react";
import type { FileStatusDetails } from "@seed-design/react/primitive";
import {
  AttachmentField,
  AttachmentInput,
  AttachmentInputItem,
} from "seed-design/ui/attachment-field";

async function uploadFile(_file: File, onProgress: (progress: number) => void): Promise<void> {
  const totalChunks = 5;
  for (let i = 1; i <= totalChunks; i++) {
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
    onProgress(Math.round((i / totalChunks) * 100));
  }

  if (Math.random() > 0.5) {
    throw new Error("Network error");
  }
}

export default function AttachmentInputErrorAlert() {
  const alertedIds = useRef<Set<string>>(new Set());

  const startUpload = useCallback(
    (
      file: File,
      id: string,
      updateFileEntryStatus: (id: string, details: FileStatusDetails) => void,
    ) => {
      updateFileEntryStatus(id, { status: "uploading", progress: 0 });

      uploadFile(file, (progress) => {
        updateFileEntryStatus(id, { status: "uploading", progress });
      })
        .then(() => updateFileEntryStatus(id, { status: "success" }))
        .catch(() => updateFileEntryStatus(id, { status: "error" }));
    },
    [],
  );

  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        maxFiles={5}
        label="파일 업로드"
        description="업로드에 실패하면 alert가 표시됩니다"
        onFileAccept={(entries, { updateFileEntryStatus }) => {
          for (const entry of entries) {
            startUpload(entry.file, entry.id, updateFileEntryStatus);
          }
        }}
        onAcceptedFileEntriesChange={(fileEntries) => {
          for (const fileEntry of fileEntries) {
            if (fileEntry.status === "error" && !alertedIds.current.has(fileEntry.id)) {
              alertedIds.current.add(fileEntry.id);
              window.alert(`업로드에 실패했습니다: ${fileEntry.file.name}`);
            }
          }

          for (const id of alertedIds.current) {
            if (!fileEntries.some((f) => f.id === id)) {
              alertedIds.current.delete(id);
            }
          }
        }}
      >
        <AttachmentInput>
          {({ acceptedFileEntries, updateFileEntryStatus }) =>
            acceptedFileEntries.map((fileEntry) => (
              <AttachmentInputItem
                key={fileEntry.id}
                fileEntry={fileEntry}
                onRetry={() => {
                  alertedIds.current.delete(fileEntry.id);
                  startUpload(fileEntry.file, fileEntry.id, updateFileEntryStatus);
                }}
              />
            ))
          }
        </AttachmentInput>
      </AttachmentField>
    </VStack>
  );
}
