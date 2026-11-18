import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

export default function Example() {
  return (
    <VStack width="full" maxWidth="480px" gap="spacingY.componentDefault">
      <TextField label="라벨" description="size=large (default)" size="large">
        <TextFieldTextarea accessibility-label="라벨" placeholder="플레이스홀더" />
      </TextField>
      <TextField label="라벨" description="size=medium" size="medium">
        <TextFieldTextarea accessibility-label="라벨" placeholder="플레이스홀더" />
      </TextField>
      <TextField variant="underline" description="size=large (default)" size="large">
        <TextFieldTextarea accessibility-label="라벨" placeholder="플레이스홀더" />
      </TextField>
      <TextField variant="underline" description="size=medium" size="medium">
        <TextFieldTextarea accessibility-label="라벨" placeholder="플레이스홀더" />
      </TextField>
    </VStack>
  );
}
