import "./styles";

import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-text-field-textarea-root`}>
      <VStack width="full" height="full" align="center" justify="center">
        <VStack width="full" maxWidth="480px">
          <TextField label="라벨">
            <TextFieldTextarea accessibility-label="라벨" />
          </TextField>
        </VStack>
      </VStack>
    </view>
  );
}
