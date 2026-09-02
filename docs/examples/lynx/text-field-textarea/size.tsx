import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack width="full" height="full" align="center" justify="center">
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
      </VStack>
    </page>
  );
}

root.render(<Root />);
