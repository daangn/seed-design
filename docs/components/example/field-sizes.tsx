import { Field, VStack } from "@seed-design/react";
import { TextFieldInput } from "seed-design/ui/text-field";

export default function FieldSizes() {
  return (
    <VStack gap="spacingY.componentDefault" width="full">
      <Field.Root size="medium">
        <Field.Header>
          <Field.Label>Medium Text Field</Field.Label>
        </Field.Header>
        <TextFieldInput inputProps={{ placeholder: "플레이스홀더" }} size="medium" />
      </Field.Root>
      <Field.Root size="large">
        <Field.Header>
          <Field.Label>Large Text Field</Field.Label>
        </Field.Header>
        <TextFieldInput inputProps={{ placeholder: "플레이스홀더" }} size="large" />
      </Field.Root>
      <Field.Root size="xlarge">
        <Field.Header>
          <Field.Label>XLarge Text Field</Field.Label>
        </Field.Header>
        <TextFieldInput inputProps={{ placeholder: "플레이스홀더" }} size="xlarge" />
      </Field.Root>
    </VStack>
  );
}
