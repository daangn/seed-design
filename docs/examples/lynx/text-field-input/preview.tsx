import "./styles";

import { root } from "@lynx-js/react";
import { Field, TextField, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="text-field-input-preview" gap="x4">
        <Field.Root className="text-field-input-preview__content">
          <Field.Header>
            <Field.Label>제목</Field.Label>
          </Field.Header>
          <TextField.Root>
            <TextField.Input
              accessibility-label="제목"
              maxlength={100}
              placeholder="제목을 입력해 주세요"
            />
          </TextField.Root>
          <Field.Footer>
            <Field.Description>한 줄로 제목을 입력해 주세요.</Field.Description>
          </Field.Footer>
        </Field.Root>
      </VStack>
    </page>
  );
}

root.render(<Root />);
