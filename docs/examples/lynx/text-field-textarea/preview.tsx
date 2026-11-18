import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

export default function Example() {
  return (
    <VStack width="full" maxWidth="480px">
      <TextField label="라벨">
        <TextFieldTextarea accessibility-label="라벨" />
      </TextField>
    </VStack>
  );
}
