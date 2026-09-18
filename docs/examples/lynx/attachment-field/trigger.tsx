import "@seed-design/lynx-css/base.css";

import type { AttachmentFileEntry, NativeFile } from "@seed-design/lynx-react";
import { AttachmentField, AttachmentInput } from "@/components/ui/attachment-field";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

const DEFAULT_FILES: AttachmentFileEntry[] = [
  {
    id: "document",
    file: {
      uri: "fixture://attachment-field/document.pdf",
      name: "document.pdf",
      type: "application/pdf",
      size: 5,
    },
    status: "success",
  },
];
const PICKED_FILES: NativeFile[] = [
  {
    uri: "fixture://attachment-field/photo.png",
    name: "photo.png",
    type: "image/png",
    size: 8,
    previewUrl: "https://picsum.photos/seed/attachment-trigger/200/200",
  },
];

export default function AttachmentFieldTrigger() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentField
          maxFiles={3}
          label="파일 업로드"
          defaultAcceptedFileEntries={DEFAULT_FILES}
          onSelectFiles={() => PICKED_FILES}
        >
          <AttachmentInput />
        </AttachmentField>
      </VStack>
    </view>
  );
}
