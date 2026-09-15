import "@seed-design/lynx-css/base.css";

import { useRef, useState } from "@lynx-js/react";
import type { NativeFile } from "@seed-design/lynx-react";
import { AttachmentField, AttachmentInput } from "@/components/ui/attachment-field";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

const INVALID_FILE: NativeFile = {
  uri: "fixture://attachment-field/document.pdf",
  name: "document.pdf",
  type: "application/pdf",
  size: 5,
};
const VALID_FILE: NativeFile = {
  uri: "fixture://attachment-field/photo.jpg",
  name: "photo.jpg",
  type: "image/jpeg",
  size: 8,
  previewUrl: "https://picsum.photos/seed/attachment-invalid/200/200",
};

export default function AttachmentFieldInvalidFileType() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const pickCount = useRef(0);
  const [errorMessage, setErrorMessage] = useState<string>();
  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentField
          accept={["image/png", "image/jpeg"]}
          maxFiles={3}
          invalid={!!errorMessage}
          errorMessage={errorMessage}
          label="이미지 업로드"
          description="PNG, JPEG 파일만 업로드할 수 있습니다"
          onSelectFiles={() => [pickCount.current++ === 0 ? INVALID_FILE : VALID_FILE]}
          onAcceptedFileEntriesChange={() => setErrorMessage(undefined)}
          onFileReject={(files) =>
            setErrorMessage(
              files
                .map(
                  ({ file, errors }) =>
                    `"${file.name}": ${errors.includes("INVALID_TYPE") ? "지원하지 않는 파일 형식입니다" : "업로드에 실패했습니다"}`,
                )
                .join("\n"),
            )
          }
        >
          <AttachmentInput />
        </AttachmentField>
      </VStack>
    </view>
  );
}
