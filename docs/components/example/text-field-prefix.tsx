import { IconMagnifyingglassLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, PrefixIcon } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextInputSizes() {
  return (
    <HStack width="full" gap="x3">
      <TextField label="라벨" description="설명을 써주세요">
        <span>https://</span>
        <TextFieldInput placeholder="플레이스홀더" />
      </TextField>
      <TextField label="라벨" description="설명을 써주세요">
        <PrefixIcon svg={<IconMagnifyingglassLine />} />
        <TextFieldInput placeholder="플레이스홀더" />
      </TextField>
    </HStack>
  );
}
