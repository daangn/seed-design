import "@seed-design/lynx-css/base.css";

import { useRef } from "@lynx-js/react";
import type { AttachmentFileStatusDetails, NativeFile } from "@seed-design/lynx-react";
import { AttachmentField, AttachmentInput } from "@/components/ui/attachment-field";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

const PICKED_FILE: NativeFile = {
  uri: "fixture://attachment-field/status.png",
  name: "status.png",
  type: "image/png",
  size: 8,
  previewUrl: "https://picsum.photos/seed/attachment-status/200/200",
};

export default function AttachmentFieldStatus() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const attempts = useRef<Record<string, number>>({});
  const startUpload = (
    id: string,
    update: (entryId: string, details: AttachmentFileStatusDetails) => void,
  ) => {
    attempts.current[id] = (attempts.current[id] ?? 0) + 1;
    update(id, { status: "uploading", progress: 0 });
    setTimeout(() => update(id, { status: "uploading", progress: 50 }), 250);
    setTimeout(() => update(id, { status: attempts.current[id] === 1 ? "error" : "success" }), 500);
  };
  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentField
          accept="image/*"
          maxFiles={5}
          label="파일 업로드"
          description="업로드 상태 시뮬레이션"
          onSelectFiles={() => [PICKED_FILE]}
          onFileAccept={(entries, { updateFileEntryStatus }) => {
            for (const entry of entries) startUpload(entry.id, updateFileEntryStatus);
          }}
        >
          <AttachmentInput
            onRetry={(entry, { updateFileEntryStatus }) =>
              startUpload(entry.id, updateFileEntryStatus)
            }
          />
        </AttachmentField>
      </VStack>
    </view>
  );
}
