import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm, type Control } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

const POSSIBLE_FRUIT_VALUES = ["apple", "melon", "mango"] as const;

type CheckFormValues = Record<(typeof POSSIBLE_FRUIT_VALUES)[number], boolean>;

interface RadioFormValues {
  fruit: (typeof POSSIBLE_FRUIT_VALUES)[number];
}

export default function SelectBoxReactHookForm() {
  // CheckSelectBox Form
  const checkForm = useForm<CheckFormValues>({
    defaultValues: { apple: false, melon: true, mango: false },
  });

  // RadioSelectBox Form
  const radioForm = useForm<RadioFormValues>({
    defaultValues: { fruit: "melon" },
  });
  const { field: radioField } = useController({ name: "fruit", control: radioForm.control });

  const onCheckValid = useCallback((data: CheckFormValues) => {
    window.alert(`CheckSelectBox:\n${JSON.stringify(data, null, 2)}`);
  }, []);

  const onRadioValid = useCallback((data: RadioFormValues) => {
    window.alert(`RadioSelectBox:\n${JSON.stringify(data, null, 2)}`);
  }, []);

  const onCheckReset = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      checkForm.reset();
    },
    [checkForm],
  );

  const onRadioReset = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      radioForm.reset();
    },
    [radioForm],
  );

  return (
    <HStack gap="x8" p="x4" width="full" align="flex-start">
      <VStack
        grow
        gap="x3"
        as="form"
        onSubmit={checkForm.handleSubmit(onCheckValid)}
        onReset={onCheckReset}
      >
        <CheckSelectBoxGroup aria-label="Fruit">
          {POSSIBLE_FRUIT_VALUES.map((name) => (
            <CheckSelectBoxItem key={name} name={name} control={checkForm.control} />
          ))}
        </CheckSelectBoxGroup>
        <HStack gap="x2">
          <ActionButton type="reset" variant="neutralWeak">
            초기화
          </ActionButton>
          <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
            제출
          </ActionButton>
        </HStack>
      </VStack>

      <VStack
        grow
        gap="x3"
        as="form"
        onSubmit={radioForm.handleSubmit(onRadioValid)}
        onReset={onRadioReset}
      >
        <RadioSelectBoxRoot aria-label="Fruit" {...radioField}>
          {POSSIBLE_FRUIT_VALUES.map((value) => (
            <RadioSelectBoxItem
              key={value}
              value={value}
              label={value}
              suffix={<RadioSelectBoxRadiomark />}
            />
          ))}
        </RadioSelectBoxRoot>
        <HStack gap="x2">
          <ActionButton type="reset" variant="neutralWeak">
            초기화
          </ActionButton>
          <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
            제출
          </ActionButton>
        </HStack>
      </VStack>
    </HStack>
  );
}

interface CheckSelectBoxItemProps {
  name: keyof CheckFormValues;
  control: Control<CheckFormValues>;
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
      suffix={<CheckSelectBoxCheckmark />}
    />
  );
}
