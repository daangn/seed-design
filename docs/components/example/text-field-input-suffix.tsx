import { IconWonLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, VStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputSuffix() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <HStack gap="x3">
        <TextField label="라벨" description="설명을 써주세요" suffix="cm">
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
        <TextField label="라벨" description="설명을 써주세요" suffixIcon={<IconWonLine />}>
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </HStack>
      <HStack gap="x3">
        <TextField variant="underline" description="설명을 써주세요" suffix="cm">
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField variant="underline" description="설명을 써주세요" suffixIcon={<IconWonLine />}>
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
      </HStack>
    </VStack>
  );
}
