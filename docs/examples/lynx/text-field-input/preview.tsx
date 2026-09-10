import "./styles";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-text-field-input-root`}>
      <VStack className="text-field-input-preview">
        <VStack className="text-field-input-preview__content">
          <TextField label="라벨">
            <TextFieldInput accessibility-label="라벨" />
          </TextField>
        </VStack>
      </VStack>
    </view>
  );
}
