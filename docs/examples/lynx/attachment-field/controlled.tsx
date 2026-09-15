import "@seed-design/lynx-css/base.css";

import { useState } from "@lynx-js/react";
import type { AttachmentFileEntry, NativeFile } from "@seed-design/lynx-react";
import { ActionButton, HStack, Text, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { AttachmentField, AttachmentInput } from "@/components/ui/attachment-field";

const PICKED_FILE: NativeFile = {
  uri: "fixture://attachment-field/controlled.txt",
  name: "controlled.txt",
  type: "text/plain",
  size: 5,
};

export default function AttachmentFieldControlled() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [acceptedFileEntries, setAcceptedFileEntries] = useState<AttachmentFileEntry[]>([]);
  function clearFiles() {
    "background only";
    setAcceptedFileEntries([]);
  }
  return (
    <view className={seedClassName}>
      <VStack gap="x4" width="100%">
        <AttachmentField
          maxFiles={5}
          label="Controlled"
          description="최대 5개까지 업로드할 수 있습니다"
          acceptedFileEntries={acceptedFileEntries}
          onAcceptedFileEntriesChange={setAcceptedFileEntries}
          onSelectFiles={() => [PICKED_FILE]}
        >
          <AttachmentInput />
        </AttachmentField>
        <Text>
          현재 파일: {JSON.stringify(acceptedFileEntries.map((entry) => entry.file.name))}
        </Text>
        <HStack gap="x2">
          <ActionButton bindtap={clearFiles} variant="neutralWeak">
            전체 삭제
          </ActionButton>
        </HStack>
      </VStack>
    </view>
  );
}
