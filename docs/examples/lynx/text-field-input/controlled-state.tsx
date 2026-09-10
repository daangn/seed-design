import "./styles";

import { useState } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("안녕하세요");

  return (
    <view className={`${seedClassName} docs-lynx-text-field-input-root`}>
      <VStack className="text-field-input-preview">
        <VStack className="text-field-input-preview__content" gap="x3">
          <TextField
            label="이름"
            description="입력값을 React state로 관리합니다."
            value={value}
            onValueChange={({ value: nextValue }) => setValue(nextValue)}
          >
            <TextFieldInput accessibility-label="이름" placeholder="홍길동" />
          </TextField>
          <text className="text-field-input-preview__status">입력값: {value}</text>
        </VStack>
      </VStack>
    </view>
  );
}
