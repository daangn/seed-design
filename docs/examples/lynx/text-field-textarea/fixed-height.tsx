import "./styles";

import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-text-field-textarea-root`}>
      <VStack width="full" height="full" align="center" justify="center">
        <VStack width="full" maxWidth="480px">
          <TextField label="라벨" description="설명을 써주세요">
            <TextFieldTextarea
              accessibility-label="라벨"
              placeholder="플레이스홀더"
              autoresize={false}
              style={{ height: "250px" }}
            />
          </TextField>
        </VStack>
      </VStack>
    </view>
  );
}
