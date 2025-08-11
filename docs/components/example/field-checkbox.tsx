import { Checkbox } from "seed-design/ui/checkbox";
import { Field, HStack } from "@seed-design/react";

export default function FieldCheckbox() {
  return (
    <HStack gap="x4" width="full">
      <Field.Root orientation="horizontal">
        <Checkbox />
        <Field.Label>Checkbox</Field.Label>
      </Field.Root>
      <Checkbox />
    </HStack>
  );
}
