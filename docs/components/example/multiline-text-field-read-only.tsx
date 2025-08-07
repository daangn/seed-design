import { HStack } from "@seed-design/react";
import { TextFieldTextarea } from "seed-design/ui/text-field";

export default function MultilineTextFieldReadOnly() {
  return (
    <HStack width="full" gap="x3">
      <TextFieldTextarea readOnly textareaProps={{ placeholder: "플레이스홀더" }} />
      <TextFieldTextarea readOnly invalid textareaProps={{ placeholder: "플레이스홀더" }} />
    </HStack>
  );
}
