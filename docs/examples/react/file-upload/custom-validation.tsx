import { useState } from "react";
import { VStack } from "@seed-design/react";
import { FileUpload } from "seed-design/ui/file-upload";

function validateFileName(file: File) {
  const nameWithoutExt = file.name.replace(/\.[^.]+$/, "");
  if (nameWithoutExt.length > 8) {
    return ["FILENAME_TOO_LONG"];
  }
  return null;
}

export default function FileUploadCustomValidation() {
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <VStack gap="x4" p="x6" width="100%">
      <FileUpload
        maxFiles={5}
        validate={validateFileName}
        invalid={!!errorMessage}
        errorMessage={errorMessage}
        label="파일 업로드"
        description="파일 이름은 확장자를 제외하고 8자 이하여야 합니다"
        onAcceptedFilesChange={() => setErrorMessage(undefined)}
        onFileReject={({ files }) => {
          if (files.every((f) => f.errors.includes("FILENAME_TOO_LONG")) === false) {
            return;
          }

          const names = files.map((f) => f.file.name).join(", ");

          setErrorMessage(`"${names}"은(는) 파일 이름이 8자를 초과합니다.`);
        }}
      />
    </VStack>
  );
}
