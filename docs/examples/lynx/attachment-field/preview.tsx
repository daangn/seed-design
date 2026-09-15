import "@seed-design/lynx-css/base.css";

import type { NativeFile } from "@seed-design/lynx-react";
import { AttachmentField, AttachmentInput } from "@/components/ui/attachment-field";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

// 문서 고정 fixture입니다. 실제 앱에서는 호스트가 제공하는 파일 선택 adapter를 전달하세요.
const FIXTURE_FILES: NativeFile[] = [
  {
    uri: "fixture://attachment-field/document.pdf",
    name: "document.pdf",
    type: "application/pdf",
    size: 5,
  },
];

export default function AttachmentFieldPreview() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentField
          maxFiles={3}
          label="파일 업로드"
          description="최대 3개까지 업로드할 수 있습니다"
          onSelectFiles={() => FIXTURE_FILES}
        >
          <AttachmentInput />
        </AttachmentField>
      </VStack>
    </view>
  );
}
