import { useCallback } from "react";
import { VStack } from "@seed-design/react";
import type { FileStatusDetails } from "@seed-design/react/primitive";
import {
  AttachmentField,
  AttachmentInput,
  AttachmentInputItem,
} from "seed-design/ui/attachment-field";

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

export default function AttachmentInputStatus() {
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
        accept="image/*"
        maxFiles={5}
        label="파일 업로드"
        description="업로드 상태 시뮬레이션"
        onFileAccept={(entries, { updateFileEntryStatus }) => {
          for (const entry of entries) {
            startUpload(entry.file, entry.id, updateFileEntryStatus);
          }
        }}
      >
        <AttachmentInput>
          {({ acceptedFileEntries, updateFileEntryStatus }) =>
            acceptedFileEntries.map((fileEntry) => (
              <AttachmentInputItem
                key={fileEntry.id}
                fileEntry={fileEntry}
                onRetry={() => startUpload(fileEntry.file, fileEntry.id, updateFileEntryStatus)}
              />
            ))
          }
        </AttachmentInput>
      </AttachmentField>
    </VStack>
  );
}
