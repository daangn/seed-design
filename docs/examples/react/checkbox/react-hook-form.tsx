import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { Checkbox } from "seed-design/ui/checkbox";

const POSSIBLE_FRUIT_VALUES = ["apple", "melon", "mango"] as const;

type FormValues = Record<(typeof POSSIBLE_FRUIT_VALUES)[number], boolean>;

export default function CheckboxReactHookForm() {
  const { handleSubmit, reset, setValue, control } = useForm<FormValues>({
    defaultValues: {
      apple: false,
      melon: true,
      mango: false,
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
    <VStack gap="x3" as="form" onSubmit={handleSubmit(onValid)} onReset={onReset}>
      <VStack>
        {POSSIBLE_FRUIT_VALUES.map((name) => {
          const {
            field: { value, ...restProps },
            fieldState: { invalid },
          } = useController({ name, control });
          return (
            <Checkbox
              key={name}
              label={name}
              checked={value}
              inputProps={restProps}
              invalid={invalid}
            />
          );
        })}
      </VStack>
      <HStack gap="x2">
        <ActionButton type="reset" variant="neutralWeak">
          초기화
        </ActionButton>
        <ActionButton
          type="button"
          variant="neutralWeak"
          flexGrow={1}
          onClick={() => setValue("mango", true)}
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
