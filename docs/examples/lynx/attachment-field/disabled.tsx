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
  {
    id: "image",
    file: {
      uri: "fixture://attachment-field/image.png",
      name: "image.png",
      type: "image/png",
      size: 8,
      previewUrl: "https://picsum.photos/seed/attachment-disabled/200/200",
    },
    status: "success",
  },
];

export default function AttachmentFieldDisabled() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentField
          disabled
          maxFiles={5}
          defaultAcceptedFileEntries={DEFAULT_FILES}
          label="파일 업로드"
          description="비활성화된 AttachmentField"
        >
          <AttachmentInput />
        </AttachmentField>
      </VStack>
    </view>
  );
}
