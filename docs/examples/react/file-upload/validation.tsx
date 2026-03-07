import { useState } from "react";
import { VStack } from "@seed-design/react";
import { FileUpload } from "seed-design/ui/file-upload";
import { formatBytes } from "seed-design/lib/format-bytes";

const MIN_FILE_SIZE = 1 * 1024; // 1KB
const MAX_FILE_SIZE = 10 * 1024; // 10KB

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "FILE_TOO_LARGE":
      return `크기가 ${formatBytes(MAX_FILE_SIZE)}를 초과합니다`;
    case "FILE_TOO_SMALL":
      return `크기가 ${formatBytes(MIN_FILE_SIZE)} 미만입니다`;
    case "TOO_MANY_FILES":
      return "업로드 가능한 파일 개수를 초과했습니다";
    default:
      return "업로드에 실패했습니다";
  }
}

export default function FileUploadValidation() {
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUpload
        maxFiles={3}
        minFileSize={MIN_FILE_SIZE}
        maxFileSize={MAX_FILE_SIZE}
        invalid={!!errorMessage}
        errorMessage={errorMessage}
        label="파일 업로드"
        description={`${formatBytes(MIN_FILE_SIZE)} ~ ${formatBytes(MAX_FILE_SIZE)} 크기의 파일만 업로드할 수 있습니다`}
        onAcceptedFilesChange={() => setErrorMessage(undefined)}
        onFileReject={({ files }) => {
          const messages = files.map(
            ({ file, errors }) => `"${file.name}": ${errors.map(getErrorMessage).join(", ")}`,
          );

          setErrorMessage(messages.join("\n"));
        }}
      />
    </VStack>
  );
}
