import "./styles";

import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-text-field-input-root`}>
      <VStack className="text-field-input-preview">
        <VStack className="text-field-input-preview__content" gap="spacingY.componentDefault">
          <TextField label="라벨" description="size=large (default)" size="large">
            <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
          </TextField>
          <TextField label="라벨" description="size=medium" size="medium">
            <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
          </TextField>
          <TextField variant="underline" description="size=large (default)" size="large">
            <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
          </TextField>
          <TextField variant="underline" description="size=medium" size="medium">
            <TextFieldInput accessibility-label="라벨" placeholder="플레이스홀더" />
          </TextField>
        </VStack>
      </VStack>
    </view>
  );
}
