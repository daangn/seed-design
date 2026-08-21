import "./styles";

import { root } from "@lynx-js/react";
import { Field, TextField, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="text-field-input-preview" gap="x4">
        <VStack className="text-field-input-preview__content" gap="spacingY.componentDefault">
          <Field.Root required>
            <Field.Header>
              <Field.Label weight="bold">
                이름
                <Field.RequiredIndicator />
              </Field.Label>
            </Field.Header>
            <TextField.Root required>
              <TextField.Input accessibility-label="이름" maxlength={30} placeholder="이름 입력" />
            </TextField.Root>
            <Field.Footer>
              <Field.Description>실명을 입력해 주세요.</Field.Description>
            </Field.Footer>
          </Field.Root>
          <Field.Root invalid>
            <Field.Header>
              <Field.Label>사용자 이름</Field.Label>
            </Field.Header>
            <TextField.Root defaultValue="이미 사용 중" invalid>
              <TextField.Input accessibility-label="사용자 이름" maxlength={20} />
            </TextField.Root>
            <Field.Footer>
              <Field.ErrorMessage>다른 사용자 이름을 입력해 주세요.</Field.ErrorMessage>
            </Field.Footer>
          </Field.Root>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
