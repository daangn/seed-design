import "@seed-design/lynx-css/base.css";

import { useRef, useState } from "@lynx-js/react";
import type { NativeFile } from "@seed-design/lynx-react";
import { AttachmentField, AttachmentInput } from "@/components/ui/attachment-field";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

const LONG_NAME_FILE: NativeFile = {
  uri: "fixture://attachment-field/filename-too-long.txt",
  name: "filename-too-long.txt",
  type: "text/plain",
  size: 5,
};
const VALID_FILE: NativeFile = {
  uri: "fixture://attachment-field/short.txt",
  name: "short.txt",
  type: "text/plain",
  size: 5,
};

export default function AttachmentFieldCustomValidation() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const pickCount = useRef(0);
  const [errorMessage, setErrorMessage] = useState<string>();
  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentField
          maxFiles={5}
          validate={(file) =>
            file.name.replace(/\.[^.]+$/, "").length > 8 ? ["FILENAME_TOO_LONG"] : null
          }
          invalid={!!errorMessage}
          errorMessage={errorMessage}
          label="파일 업로드"
          description="파일 이름은 확장자를 제외하고 8자 이하여야 합니다"
          onSelectFiles={() => [pickCount.current++ === 0 ? LONG_NAME_FILE : VALID_FILE]}
          onAcceptedFileEntriesChange={() => setErrorMessage(undefined)}
          onFileReject={(files) => {
            if (files.every((file) => file.errors.includes("FILENAME_TOO_LONG")))
              setErrorMessage(
                `"${files.map((file) => file.file.name).join(", ")}"은(는) 파일 이름이 8자를 초과합니다.`,
              );
          }}
        >
          <AttachmentInput />
        </AttachmentField>
      </VStack>
    </view>
  );
}
