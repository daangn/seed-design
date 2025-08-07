import { IconWonLine } from "@karrotmarket/react-monochrome-icon";
import { HStack } from "@seed-design/react";
import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldSuffix() {
  return (
    <HStack width="full" gap="x3">
      <TextFieldInput inputProps={{ placeholder: "플레이스홀더" }} suffix="cm" />
      <TextFieldInput inputProps={{ placeholder: "플레이스홀더" }} suffixIcon={<IconWonLine />} />
    </HStack>
  );
}
