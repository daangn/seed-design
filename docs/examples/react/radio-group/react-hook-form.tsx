import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

const POSSIBLE_COLORS = ["red", "blue", "green"] as const;

interface FormValues {
  color: (typeof POSSIBLE_COLORS)[number];
}

export default function RadioGroupReactHookForm() {
  const { handleSubmit, reset, setValue, control } = useForm<FormValues>({
    defaultValues: {
      color: "blue",
    },
  });
  const { field } = useController({ name: "color", control });

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
    <VStack p="x6" as="form" onSubmit={handleSubmit(onValid)}>
      <VStack gap="x3">
        <RadioGroup
          value={field.value}
          onValueChange={(value) => setValue("color", value as FormValues["color"])}
          aria-label="Color selection"
        >
          {POSSIBLE_COLORS.map((color) => (
            <RadioGroupItem
              key={color}
              value={color}
              label={color.charAt(0).toUpperCase() + color.slice(1)}
              tone="neutral"
              size="large"
            />
          ))}
        </RadioGroup>

        <HStack gap="x3">
          <ActionButton type="submit" variant="neutralSolid">
            Submit
          </ActionButton>
          <ActionButton variant="neutralWeak" onClick={onReset}>
            Reset
          </ActionButton>
        </HStack>
      </VStack>
    </VStack>
  );
}
