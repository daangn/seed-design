import "./styles";

import { root, useState } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldTextarea } from "@/components/ui/text-field";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("안녕하세요");

  return (
    <page className={seedClassName}>
      <VStack width="full" height="full" align="center" justify="center">
        <VStack width="full" maxWidth="480px" gap="x3">
          <TextField
            label="자기소개"
            description="입력값을 React state로 관리합니다."
            value={value}
            onValueChange={({ value: nextValue }) => setValue(nextValue)}
          >
            <TextFieldTextarea accessibility-label="자기소개" placeholder="저는…" />
          </TextField>
          <text className="text-field-textarea-preview__status">입력값: {value}</text>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
