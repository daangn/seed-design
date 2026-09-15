import "@seed-design/lynx-css/base.css";

import { useRef, useState } from "@lynx-js/react";
import type { NativeFile } from "@seed-design/lynx-react";
import { AttachmentField, AttachmentInput } from "@/components/ui/attachment-field";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

const MIN_FILE_SIZE = 1024;
const MAX_FILE_SIZE = 10 * 1024;
const SMALL_FILE: NativeFile = {
  uri: "fixture://attachment-field/small.txt",
  name: "small.txt",
  type: "text/plain",
  size: 1,
};
const VALID_FILE: NativeFile = {
  uri: "fixture://attachment-field/valid.txt",
  name: "valid.txt",
  type: "text/plain",
  size: 2048,
};

export default function AttachmentFieldValidation() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const pickCount = useRef(0);
  const [errorMessage, setErrorMessage] = useState<string>();
  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentField
          maxFiles={3}
          minFileSize={MIN_FILE_SIZE}
          maxFileSize={MAX_FILE_SIZE}
          invalid={!!errorMessage}
          errorMessage={errorMessage}
          label="파일 업로드"
          description="1KB ~ 10KB 크기의 파일만 업로드할 수 있습니다"
          onSelectFiles={() => [pickCount.current++ === 0 ? SMALL_FILE : VALID_FILE]}
          onAcceptedFileEntriesChange={() => setErrorMessage(undefined)}
          onFileReject={(files) =>
            setErrorMessage(
              files
                .map(
                  ({ file, errors }) =>
                    `"${file.name}": ${errors.includes("FILE_TOO_SMALL") ? "크기가 1KB 미만입니다" : errors.includes("FILE_TOO_LARGE") ? "크기가 10KB를 초과합니다" : "업로드에 실패했습니다"}`,
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
