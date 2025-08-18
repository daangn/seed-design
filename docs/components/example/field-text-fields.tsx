import { Field, HStack } from "@seed-design/react";
import { TextFieldInput, TextFieldTextarea } from "seed-design/ui/text-field";

export default function FieldTextFields() {
  return (
    <HStack gap="x4" width="full">
      <Field.Root>
        <Field.Header>
          <Field.Label>Text Field</Field.Label>
        </Field.Header>
        <TextFieldInput textareaProps={{ placeholder: "플레이스홀더" }} />
      </Field.Root>
      <Field.Root>
        <Field.Header>
          <Field.Label>Multiline Text Field</Field.Label>
        </Field.Header>
        <TextFieldTextarea textareaProps={{ placeholder: "플레이스홀더" }} />
      </Field.Root>
    </HStack>
  );
}
