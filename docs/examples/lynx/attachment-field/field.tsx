import "@seed-design/lynx-css/base.css";

import type { NativeFile } from "@seed-design/lynx-react";
import { AttachmentField, AttachmentInput } from "@/components/ui/attachment-field";
import { Divider, VStack, useSeedClassName } from "@seed-design/lynx-react";

const PICKED_FILE: NativeFile = {
  uri: "fixture://attachment-field/field.txt",
  name: "field.txt",
  type: "text/plain",
  size: 5,
};

export default function AttachmentFieldField() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={seedClassName}>
      <VStack gap="x8" width="100%">
        <AttachmentField
          maxFiles={3}
          label="첨부파일"
          labelWeight="bold"
          required
          showRequiredIndicator
          invalid
          errorMessage="필수 항목입니다."
        >
          <AttachmentInput />
        </AttachmentField>
        <Divider />
        <AttachmentField
          maxFiles={3}
          label="첨부파일"
          description="파일을 선택하거나 호스트 파일 선택기를 여세요."
          indicator="선택"
          onSelectFiles={() => [PICKED_FILE]}
        >
          <AttachmentInput />
        </AttachmentField>
      </VStack>
    </view>
  );
}
