import { IconPlusCircleLine, IconWonLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, PrefixIcon, SuffixIcon } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldBothAffixes() {
  return (
    <HStack width="full" gap="x3">
      <TextField label="라벨" description="설명을 써주세요">
        <span>만</span>
        <TextFieldInput placeholder="플레이스홀더" />
        <span>세</span>
      </TextField>
      <TextField label="라벨" description="설명을 써주세요">
        <PrefixIcon svg={<IconPlusCircleLine />} />
        <TextFieldInput placeholder="플레이스홀더" />
        <SuffixIcon svg={<IconWonLine />} />
      </TextField>
    </HStack>
  );
}
