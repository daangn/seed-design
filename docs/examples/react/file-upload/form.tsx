import { VStack } from "@seed-design/react";
import { useState, type FormEvent } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { FileUploadField, FileUpload } from "seed-design/ui/file-upload";

type FieldErrors = {
  files?: string;
};

export default function FileUploadForm() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      setFieldErrors({ files: "최소 1개의 파일을 업로드해주세요" });
      return;
    }

    window.alert(`제출된 파일: ${files.map((f) => f.name).join(", ")}`);
  };

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
