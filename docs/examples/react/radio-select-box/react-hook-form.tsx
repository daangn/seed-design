import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { RadioSelectBoxItem, RadioSelectBoxRoot } from "seed-design/ui/select-box";

const POSSIBLE_FRUIT_VALUES = ["apple", "melon", "mango"] as const;

interface FormValues {
  fruit: (typeof POSSIBLE_FRUIT_VALUES)[number];
}

export default function RadioSelectBoxReactHookForm() {
  const { handleSubmit, reset, setValue, control } = useForm<FormValues>({
    defaultValues: {
      fruit: "melon",
    },
  });
  const { field } = useController({ name: "fruit", control });

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
      <RadioSelectBoxRoot aria-label="Fruit" {...field}>
        <VStack gap="spacingY.componentDefault">
          {POSSIBLE_FRUIT_VALUES.map((value) => (
            <RadioSelectBoxItem key={value} value={value} label={value} />
          ))}
        </VStack>
      </RadioSelectBoxRoot>
      <HStack gap="x2">
        <ActionButton type="reset" variant="neutralWeak">
          초기화
        </ActionButton>
        <ActionButton
          type="button"
          variant="neutralWeak"
          onClick={() => setValue("fruit", "mango")}
        >
          mango 선택
        </ActionButton>
        <ActionButton type="submit" flexGrow={1}>
          제출
        </ActionButton>
      </HStack>
    </VStack>
  );
}
