import { VStack } from "@seed-design/react";
import { useCallback, useRef, useState, type FormEvent } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { FileUploadField, FileUpload } from "seed-design/ui/file-upload";

type FieldErrors = {
  files?: string;
};

export default function FileUploadForm() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const acceptedFilesRef = useRef<File[]>([]);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newFieldErrors: FieldErrors = {};

    if (acceptedFilesRef.current.length === 0) {
      newFieldErrors.files = "최소 1개의 파일을 업로드해주세요";
    }

    setFieldErrors(newFieldErrors);

    if (Object.keys(newFieldErrors).length > 0) return;

    window.alert(`제출된 파일: ${acceptedFilesRef.current.map((f) => f.name).join(", ")}`);
  }, []);

  return (
    <VStack asChild gap="x3" width="full">
      <form onSubmit={handleSubmit}>
        <FileUploadField
          name="files"
          maxFiles={3}
          label="첨부파일"
          description="최대 3개까지 업로드할 수 있습니다"
          required
          showRequiredIndicator
          onAcceptedFileEntriesChange={(files) => {
            acceptedFilesRef.current = files.map((f) => f.file);
            if (files.length > 0) {
              setFieldErrors({});
            }
          }}
          {...(fieldErrors.files && { invalid: true, errorMessage: fieldErrors.files })}
        >
          <FileUpload />
        </FileUploadField>
        <ActionButton type="submit" variant="neutralSolid">
          제출
        </ActionButton>
      </form>
    </VStack>
  );
}
