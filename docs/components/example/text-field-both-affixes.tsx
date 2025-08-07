import { IconPlusCircleLine, IconWonLine } from "@karrotmarket/react-monochrome-icon";
import { HStack } from "@seed-design/react";
import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldBothAffixes() {
  return (
    <HStack width="full" gap="x3">
      <TextFieldInput prefix="만" suffix="세" inputProps={{ placeholder: "플레이스홀더" }} />
      <TextFieldInput
        prefixIcon={<IconPlusCircleLine />}
        suffixIcon={<IconWonLine />}
        inputProps={{ placeholder: "플레이스홀더" }}
      />
    </HStack>
  );
}
