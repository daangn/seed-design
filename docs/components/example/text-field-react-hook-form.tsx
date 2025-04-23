import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

interface FormValues {
  name: string;
  address: string;
}

export default function TextFieldReactHookForm() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: {
      name: "",
      address: "",
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
        <Controller
          control={control}
          name="name"
          rules={{ required: "필수 입력 항목입니다" }}
          render={({ field, fieldState }) => (
            <TextField
              label="이름"
              indicator="(필수)"
              description="이름을 써주세요"
              required
              invalid={fieldState.invalid}
              errorMessage={fieldState.error?.message}
              disabled={field.disabled}
              value={field.value}
              onValueChange={({ value }) => field.onChange(value)}
            >
              <TextFieldInput placeholder="홍길동" name={field.name} onBlur={field.onBlur} />
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="address"
          rules={{
            required: "필수 입력 항목입니다",
            pattern: { value: /^대한민국/, message: "대한민국으로 시작해주세요" },
          }}
          render={({ field, fieldState }) => (
            <TextField
              label="주소"
              indicator="(필수)"
              description="주소를 써주세요"
              invalid={fieldState.invalid}
              errorMessage={fieldState.error?.message}
              maxGraphemeCount={30}
              required
              disabled={field.disabled}
              value={field.value}
              onValueChange={({ value }) => field.onChange(value)}
            >
              <TextFieldInput placeholder="대한민국" name={field.name} onBlur={field.onBlur} />
            </TextField>
          )}
        />
      </HStack>
      <HStack gap="x2">
        <ActionButton type="reset" variant="neutralWeak">
          초기화
        </ActionButton>
        <ActionButton type="submit" flexGrow={1}>
          제출
        </ActionButton>
      </HStack>
    </VStack>
  );
}
