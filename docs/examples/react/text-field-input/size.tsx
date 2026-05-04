import { HStack, VStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputSize() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <HStack gap="x3">
        <TextField label="라벨" description="size=large (default)" size="large">
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
        <TextField label="라벨" description="size=medium" size="medium">
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
        <TextField label="라벨" description="size=responsive" size="responsive">
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </HStack>
      <HStack gap="x3">
        <TextField variant="underline" description="size=large (default)" size="large">
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField variant="underline" description="size=medium" size="medium">
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField variant="underline" description="size=responsive" size="responsive">
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
      </HStack>
    </VStack>
  );
}
