import "./styles";

import { useState } from "@lynx-js/react";
import { VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

export default function Example() {
  const [value, setValue] = useState("");

  return (
    <VStack width="full" maxWidth="480px">
      <TextField
        label="레이블"
        description="공백을 입력할 수 없어요"
        value={value}
        onValueChange={({ value: nextValue }) => setValue(nextValue.replace(/ /g, ""))}
      >
        <TextFieldTextarea accessibility-label="레이블" placeholder="공백을 입력해보세요" />
      </TextField>
    </VStack>
  );
}
