import { HStack } from "@seed-design/react";
import { TextFieldTextarea } from "seed-design/ui/text-field";

export default function MultilineTextFieldDisabled() {
  return (
    <HStack width="full" gap="x3">
      <TextFieldTextarea disabled textareaProps={{ placeholder: "플레이스홀더" }} />
      <TextFieldTextarea disabled invalid textareaProps={{ placeholder: "플레이스홀더" }} />
    </HStack>
  );
}
