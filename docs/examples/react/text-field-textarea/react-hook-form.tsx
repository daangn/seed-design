import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent, type KeyboardEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

interface FormValues {
  bio: string;
  address: string;
}

export default function TextFieldTextareaReactHookForm() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    reValidateMode: "onSubmit",
    defaultValues: {
      bio: "",
      address: "",
    },
  });

  const {
    field: { onChange: bioOnChange, ...bioField },
    fieldState: bioFieldState,
  } = useController({
    name: "bio",
    control,
    rules: {
      required: "필수 입력 항목입니다",
    },
  });
  const {
    field: { onChange: addressOnChange, ...addressField },
    fieldState: addressFieldState,
  } = useController({
    name: "address",
    control,
    rules: {
      required: "필수 입력 항목입니다",
      pattern: { value: /^대한민국/, message: "대한민국으로 시작해주세요" },
    },
  });

  const onValid = useCallback(
    (data: FormValues) => window.alert(JSON.stringify(data, null, 2)),
    [],
  );

  const onReset = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      reset();
    },
    [reset],
  );

  const onMetaReturn = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();

        handleSubmit(onValid)();
      }
    },
    [handleSubmit, onValid],
  );

  return (
    <VStack gap="x3" width="full" as="form" onSubmit={handleSubmit(onValid)} onReset={onReset}>
      <HStack gap="x2">
        <TextField
          label="자기소개"
          description="자기소개를 써주세요"
          invalid={bioFieldState.invalid}
          errorMessage={bioFieldState.error?.message}
          onValueChange={({ value }) => bioOnChange(value)}
          required
          showRequiredIndicator
          {...bioField}
        >
          <TextFieldTextarea placeholder="저는…" onKeyDown={onMetaReturn} />
        </TextField>
        <TextField
          label="주소"
          description="주소를 써주세요"
          invalid={addressFieldState.invalid}
          errorMessage={addressFieldState.error?.message}
          maxGraphemeCount={30}
          onValueChange={({ slicedValue }) => addressOnChange(slicedValue)}
          required
          showRequiredIndicator
          {...addressField}
        >
          <TextFieldTextarea placeholder="대한민국" onKeyDown={onMetaReturn} />
        </TextField>
      </HStack>
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
