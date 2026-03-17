import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import type { FileWithStatus } from "@seed-design/react/primitive";
import { FileUploadField, FileUpload } from "seed-design/ui/file-upload";

interface FormValues {
  files: FileWithStatus[];
}

export default function FileUploadReactHookForm() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    reValidateMode: "onSubmit",
    defaultValues: {
      files: [],
    },
  });

  const {
    field: { value, onChange, ...field },
    fieldState,
  } = useController({
    name: "files",
    control,
    rules: {
      validate: (value) => value.length > 0 || "최소 1개의 파일을 업로드해주세요",
    },
  });

  const onValid = useCallback(
    (data: FormValues) =>
      window.alert(`제출된 파일: ${data.files.map((f) => f.file.name).join(", ")}`),
    [],
  );

  const onReset = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      reset();
    },
    [reset],
  );

  return (
    <VStack gap="x3" width="full" as="form" onSubmit={handleSubmit(onValid)} onReset={onReset}>
      <FileUploadField
        maxFiles={5}
        label="첨부파일"
        description="최대 5개까지 업로드할 수 있습니다"
        showRequiredIndicator
        invalid={fieldState.invalid}
        errorMessage={fieldState.error?.message}
        acceptedFiles={value}
        onAcceptedFilesChange={onChange}
        {...field}
      >
        <FileUpload />
      </FileUploadField>
      <HStack gap="x2">
        <ActionButton type="reset" variant="neutralWeak">
          초기화
        </ActionButton>
        <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
          제출
        </ActionButton>
      </HStack>
    </VStack>
  );
}
