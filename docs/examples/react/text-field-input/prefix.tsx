import { IconMagnifyingglassLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, VStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputPrefix() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <HStack gap="x3">
        <TextField label="라벨" description="설명을 써주세요" prefix="https://">
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
        <TextField
          label="라벨"
          description="설명을 써주세요"
          prefixIcon={<IconMagnifyingglassLine />}
        >
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </HStack>
      <HStack gap="x3">
        <TextField variant="underline" description="설명을 써주세요" prefix="https://">
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField
          variant="underline"
          description="설명을 써주세요"
          prefixIcon={<IconMagnifyingglassLine />}
        >
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
      </HStack>
    </VStack>
  );
}
