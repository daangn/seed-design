import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm, type Control } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

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
    <VStack gap="x3" p="x6" as="form" onSubmit={handleSubmit(onValid)} onReset={onReset}>
      <CheckboxGroup aria-label="Fruit selection">
        {POSSIBLE_FRUIT_VALUES.map((name) => (
          <CheckboxItem key={name} name={name} control={control} />
        ))}
      </CheckboxGroup>
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
        <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
          제출
        </ActionButton>
      </HStack>
    </VStack>
  );
}

interface CheckboxItemProps {
  name: keyof FormValues;
  control: Control<FormValues>;
}

function CheckboxItem({ name, control }: CheckboxItemProps) {
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
      tone="neutral"
      size="large"
    />
  );
}
