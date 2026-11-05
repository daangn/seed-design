import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

export default function Example() {
  return (
    <VStack width="full" maxWidth="480px">
      <TextField label="라벨" description="설명을 써주세요">
        <TextFieldTextarea
          accessibility-label="라벨"
          placeholder="플레이스홀더"
          style={{ minHeight: "200px", maxHeight: "300px" }}
        />
      </TextField>
    </VStack>
  );
}
