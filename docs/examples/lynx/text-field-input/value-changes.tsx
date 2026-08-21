import "./styles";

import { root, useState } from "@lynx-js/react";
import { TextField, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("");
  const [changeCount, setChangeCount] = useState(0);

  function handleValueChange(nextValue: string) {
    "background only";

    setValue(nextValue);
    setChangeCount((previous) => previous + 1);
  }

  return (
    <page className={seedClassName}>
      <VStack className="text-field-input-preview" gap="x4">
        <VStack className="text-field-input-preview__content" gap="x3">
          <TextField.Root value={value} onValueChange={handleValueChange}>
            <TextField.Input
              accessibility-label="닉네임"
              maxlength={20}
              placeholder="닉네임을 입력해 주세요"
            />
          </TextField.Root>
          <text className="text-field-input-preview__status">
            입력값: {JSON.stringify(value)}, 변경 횟수: {JSON.stringify(changeCount)}
          </text>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
