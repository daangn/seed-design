import { HStack } from "@seed-design/react";
import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldReadOnly() {
  return (
    <HStack width="full" gap="x3">
      <TextFieldInput inputProps={{ placeholder: "플레이스홀더" }} readOnly />
      <TextFieldInput inputProps={{ placeholder: "플레이스홀더" }} readOnly invalid />
    </HStack>
  );
}
