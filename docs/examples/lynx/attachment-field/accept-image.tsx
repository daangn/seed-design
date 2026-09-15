import "@seed-design/lynx-css/base.css";

import { useRef, useState } from "@lynx-js/react";
import type { NativeFile } from "@seed-design/lynx-react";
import { AttachmentField, AttachmentInput } from "@/components/ui/attachment-field";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

const IMAGE_FILE: NativeFile = {
  uri: "fixture://attachment-field/photo.png",
  name: "photo.png",
  type: "image/png",
  size: 8,
  previewUrl: "https://picsum.photos/seed/attachment-image/200/200",
};
const OTHER_FILE: NativeFile = {
  uri: "fixture://attachment-field/readme.pdf",
  name: "readme.pdf",
  type: "application/pdf",
  size: 5,
};

export default function AttachmentFieldAcceptImage() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const pickCount = useRef(0);
  const [errorMessage, setErrorMessage] = useState<string>();
  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentField
          accept="image/*"
          maxFiles={5}
          label="이미지 업로드"
          description="이미지 파일만 허용됩니다"
          invalid={!!errorMessage}
          errorMessage={errorMessage}
          onSelectFiles={() => [pickCount.current++ === 0 ? IMAGE_FILE : OTHER_FILE]}
          onAcceptedFileEntriesChange={() => setErrorMessage(undefined)}
          onFileReject={() => setErrorMessage("지원하지 않는 파일 형식입니다")}
        >
          <AttachmentInput />
        </AttachmentField>
      </VStack>
    </view>
  );
}
