import { VStack, HStack } from "@seed-design/react";
import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";
import { ActionButton } from "seed-design/ui/action-button";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";

interface FormValues {
  text: string;
  count: number;
}

export default function FieldButtonReactHookFormSimple() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: {
      text: "",
      count: 0,
    },
  });

  const {
    field: { onChange: textOnChange, ...textField },
    fieldState: textFieldState,
  } = useController({
    name: "text",
    control,
    rules: {
      required: "필수 입력 항목입니다",
    },
  });

  const {
    field: { value: countValue, onChange: countOnChange, ...countField },
    fieldState: countFieldState,
  } = useController({
    name: "count",
    control,
    rules: {
      validate: (value) => value >= 3 || "최소 3회 이상 클릭해야 합니다",
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
    <VStack asChild width="full" gap="spacingY.componentDefault">
      <form onSubmit={handleSubmit(onValid)} onReset={onReset}>
        <HStack gap="x3">
          <TextField
            label="TextField"
            description="이것은 TextField입니다. FieldButton과 어떻게 다른지 비교해보세요."
            invalid={textFieldState.invalid}
            errorMessage={textFieldState.error?.message}
            onValueChange={({ value }) => textOnChange(value)}
            showRequiredIndicator
            {...textField}
          >
            <TextFieldInput placeholder="TextFieldInput" />
          </TextField>
          <FieldButton
            label="input을 포함한 FieldButton"
            description={`이 FieldButton은 <input type="hidden" /> 요소를 한 개 포함하고 있습니다. 자세한 내용은 예시 코드를 참고하세요.`}
            invalid={countFieldState.invalid}
            errorMessage={countFieldState.error?.message}
            values={[`${countValue}`]}
            onValuesChange={([value]) => countOnChange(Number(value))}
            buttonProps={{
              onClick: () => countOnChange(countValue + 1),
              "aria-label": "카운트 증가",
            }}
            showRequiredIndicator
            {...countField}
          >
            <FieldButtonValue>현재 카운트: {countValue}</FieldButtonValue>
          </FieldButton>
        </HStack>
        <HStack gap="x2">
          <ActionButton type="reset" variant="neutralWeak">
            초기화
          </ActionButton>
          <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
            제출
          </ActionButton>
        </HStack>
      </form>
    </VStack>
  );
}
