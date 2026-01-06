import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm, type Control } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { CheckSelectBox, CheckSelectBoxGroup } from "seed-design/ui/select-box";

const POSSIBLE_FRUIT_VALUES = ["apple", "melon", "mango"] as const;

type FormValues = Record<(typeof POSSIBLE_FRUIT_VALUES)[number], boolean>;

export default function CheckSelectBoxReactHookForm() {
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
    <VStack gap="x3" width="full" as="form" onSubmit={handleSubmit(onValid)} onReset={onReset}>
      <CheckSelectBoxGroup>
        <VStack gap="spacingY.componentDefault">
          {POSSIBLE_FRUIT_VALUES.map((name) => (
            <CheckSelectBoxItem key={name} name={name} control={control} />
          ))}
        </VStack>
      </CheckSelectBoxGroup>
      <HStack gap="x2">
        <ActionButton type="reset" variant="neutralWeak">
          초기화
        </ActionButton>
        <ActionButton type="button" variant="neutralWeak" onClick={() => setValue("mango", true)}>
          mango 선택
        </ActionButton>
        <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
          제출
        </ActionButton>
      </HStack>
    </VStack>
  );
}

interface CheckSelectBoxItemProps {
  name: keyof FormValues;
  control: Control<FormValues>;
}

function CheckSelectBoxItem({ name, control }: CheckSelectBoxItemProps) {
  const {
    field: { value, ...restProps },
    fieldState: { invalid },
  } = useController({ name, control });

  return (
    <CheckSelectBox
      key={name}
      label={name}
      checked={value}
      inputProps={restProps}
      invalid={invalid}
    />
  );
}
