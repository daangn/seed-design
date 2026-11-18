import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { CardNumberField } from "seed-design/ui/card-number-field";
import { ResidentNumberField } from "seed-design/ui/resident-number-field";

interface FormValues {
  residentNumber: string[];
  cardNumber: string[];
}

export default function SegmentedTextInputReactHookForm() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    reValidateMode: "onSubmit",
    defaultValues: {
      residentNumber: ["", ""],
      cardNumber: ["", "", "", ""],
    },
  });

  const { field: residentNumberField, fieldState: residentNumberFieldState } = useController({
    name: "residentNumber",
    control,
    rules: {
      validate: ([birth = "", back = ""]) =>
        (birth.length === 6 && back.length === 1) || "주민등록번호 앞 7자리를 모두 입력해주세요",
    },
  });

  const { field: cardNumberField, fieldState: cardNumberFieldState } = useController({
    name: "cardNumber",
    control,
    rules: {
      validate: (value) =>
        value.every((segment) => segment.length === 4) || "카드번호 16자리를 모두 입력해주세요",
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
    <VStack
      gap="x3"
      width="358px"
      maxWidth="100%"
      as="form"
      onSubmit={handleSubmit(onValid)}
      onReset={onReset}
    >
      <ResidentNumberField
        label="주민등록번호"
        invalid={residentNumberFieldState.invalid}
        errorMessage={residentNumberFieldState.error?.message}
        value={residentNumberField.value}
        onValueChange={residentNumberField.onChange}
        onBlur={residentNumberField.onBlur}
        required
        showRequiredIndicator
      />
      <CardNumberField
        label="카드번호"
        invalid={cardNumberFieldState.invalid}
        errorMessage={cardNumberFieldState.error?.message}
        value={cardNumberField.value}
        onValueChange={cardNumberField.onChange}
        onBlur={cardNumberField.onBlur}
        required
        showRequiredIndicator
      />
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
