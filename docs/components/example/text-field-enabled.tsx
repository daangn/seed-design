import { HStack } from "@seed-design/react";
import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldEnabled() {
  return (
    <HStack width="full" gap="x3">
      <TextFieldInput inputProps={{ placeholder: "플레이스홀더" }} />
      <TextFieldInput inputProps={{ placeholder: "플레이스홀더" }} />
    </HStack>
  );
}
