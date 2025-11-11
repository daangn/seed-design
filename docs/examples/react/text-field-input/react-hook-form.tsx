import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

interface FormValues {
  name: string;
  address: string;
}

export default function TextFieldInputReactHookForm() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    reValidateMode: "onSubmit",
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const {
    field: { onChange: nameOnChange, ...nameField },
    fieldState: nameFieldState,
  } = useController({
    name: "name",
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

  const onValid = useCallback((data: FormValues) => {
    window.alert(JSON.stringify(data, null, 2));
  }, []);

  const onReset = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      reset();
    },
    [reset],
  );

  return (
    <VStack gap="x3" width="full" as="form" onSubmit={handleSubmit(onValid)} onReset={onReset}>
      <HStack gap="x2">
        <TextField
          label="이름"
          description="이름을 써주세요"
          invalid={nameFieldState.invalid}
          errorMessage={nameFieldState.error?.message}
          onValueChange={({ value }) => nameOnChange(value)}
          required
          showRequiredIndicator
          {...nameField}
        >
          <TextFieldInput placeholder="홍길동" />
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
          <TextFieldInput placeholder="대한민국" />
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
