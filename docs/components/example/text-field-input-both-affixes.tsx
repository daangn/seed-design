import { IconPlusCircleLine, IconWonLine } from "@karrotmarket/react-monochrome-icon";
import { HStack } from "@seed-design/react";
import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputBothAffixes() {
  return (
    <HStack width="full" gap="x3">
      <TextFieldInput
        label="라벨"
        description="설명을 써주세요"
        prefix="만"
        suffix="세"
        inputProps={{ placeholder: "플레이스홀더" }}
      />
      <TextFieldInput
        label="라벨"
        description="설명을 써주세요"
        prefixIcon={<IconPlusCircleLine />}
        suffixIcon={<IconWonLine />}
        inputProps={{ placeholder: "플레이스홀더" }}
      />
    </HStack>
  );
}
