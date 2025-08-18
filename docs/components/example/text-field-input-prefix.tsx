import { IconMagnifyingglassLine } from "@karrotmarket/react-monochrome-icon";
import { HStack } from "@seed-design/react";
import { TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputPrefix() {
  return (
    <HStack width="full" gap="x3">
      <TextFieldInput
        label="라벨"
        description="설명을 써주세요"
        prefix="https://"
        inputProps={{ placeholder: "플레이스홀더" }}
      />
      <TextFieldInput
        label="라벨"
        description="설명을 써주세요"
        prefixIcon={<IconMagnifyingglassLine />}
        inputProps={{ placeholder: "플레이스홀더" }}
      />
    </HStack>
  );
}
