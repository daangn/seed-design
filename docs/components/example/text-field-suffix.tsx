import { IconWonLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, SuffixIcon } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldSuffix() {
  return (
    <HStack width="full" gap="x3">
      <TextField label="라벨" description="설명을 써주세요">
        <TextFieldInput placeholder="플레이스홀더" />
        <span>cm</span>
      </TextField>
      <TextField label="라벨" description="설명을 써주세요">
        <TextFieldInput placeholder="플레이스홀더" />
        <SuffixIcon svg={<IconWonLine />} />
      </TextField>
    </HStack>
  );
}
