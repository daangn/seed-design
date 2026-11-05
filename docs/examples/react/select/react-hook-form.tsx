import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

interface FormValues {
  fruit: string[];
}

export default function SelectReactHookForm() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    reValidateMode: "onSubmit",
    defaultValues: {
      fruit: [],
    },
  });

  // SelectRoot is not a forwardRef component, so pass only the field props it
  // accepts instead of spreading `...field` (which carries a `ref`).
  const {
    field: { value, onChange, name },
    fieldState,
  } = useController({
    name: "fruit",
    control,
    rules: {
      validate: (value) => value.length > 0 || "과일을 선택해주세요",
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

  return (
    <VStack gap="x3" width="full" as="form" onSubmit={handleSubmit(onValid)} onReset={onReset}>
      <SelectRoot
        name={name}
        label="과일"
        description="가장 좋아하는 과일을 선택하세요"
        invalid={fieldState.invalid}
        errorMessage={fieldState.error?.message}
        value={value}
        onValueChange={onChange}
        showRequiredIndicator
      >
        <SelectTrigger placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
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
