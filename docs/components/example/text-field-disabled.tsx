import { HStack } from "@seed-design/react";
import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldDisabled() {
  return (
    <HStack width="full" gap="x3">
      <TextFieldInput disabled inputProps={{ placeholder: "플레이스홀더" }} />
      <TextFieldInput disabled invalid inputProps={{ placeholder: "플레이스홀더" }} />
    </HStack>
  );
}
