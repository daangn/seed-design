import "@seed-design/lynx-css/base.css";

import { useState } from "@lynx-js/react";
import type { NativeFile } from "@seed-design/lynx-react";
import {
  AttachmentField,
  AttachmentInput,
  AttachmentInputItem,
} from "@/components/ui/attachment-field";
import { Text, VStack, useSeedClassName } from "@seed-design/lynx-react";

const PICKED_FILES: NativeFile[] = [
  {
    uri: "fixture://attachment-field/value-changes.txt",
    name: "value-changes.txt",
    type: "text/plain",
    size: 12,
  },
];

export default function AttachmentFieldValueChanges() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [logs, setLogs] = useState<string[]>([]);
  const addLog = (message: string) => setLogs((previous) => [...previous, message]);

  return (
    <view className={seedClassName}>
      <VStack gap="x4" width="100%" align="center">
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
          onSelectFiles={() => PICKED_FILES}
          onFileAccept={(entries, { updateFileEntryStatus }) => {
            addLog(`onFileAccept: ${entries.map((entry) => entry.file.name).join(", ")}`);
            for (const entry of entries) {
              updateFileEntryStatus(entry.id, { status: "uploading", progress: 0 });
              setTimeout(
                () => updateFileEntryStatus(entry.id, { status: "uploading", progress: 50 }),
                250,
              );
              setTimeout(() => updateFileEntryStatus(entry.id, { status: "success" }), 500);
            }
          }}
          onAcceptedFileEntriesChange={(entries) =>
            addLog(
              `onAcceptedFileEntriesChange: ${entries.map((entry) => `${entry.file.name} (${entry.status})`).join(", ")}`,
            )
          }
          onFileReject={(files) =>
            addLog(
              `onFileReject: ${files.map((file) => `${file.file.name} (${file.errors.join(", ")})`).join(", ")}`,
            )
          }
        >
          <AttachmentInput>
            {({ acceptedFileEntries }) =>
              acceptedFileEntries.map((fileEntry) => (
                <AttachmentInputItem key={fileEntry.id} fileEntry={fileEntry} />
              ))
            }
          </AttachmentInput>
        </AttachmentField>
      </VStack>
    </view>
  );
}
