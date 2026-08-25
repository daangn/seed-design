import "./styles";

import { root } from "@lynx-js/react";
import { Field, TextField, VStack, useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="text-field-input-preview" gap="x4">
        <VStack className="text-field-input-preview__content" gap="spacingY.componentDefault">
          <Field.Root>
            <Field.Header>
              <Field.Label>프로필 주소</Field.Label>
            </Field.Header>
            <TextField.Root>
              <TextField.PrefixText>https://</TextField.PrefixText>
              <TextField.Input
                accessibility-label="프로필 주소"
                maxlength={100}
                placeholder="example.com"
              />
            </TextField.Root>
          </Field.Root>
          <Field.Root>
            <Field.Header>
              <Field.Label>나이</Field.Label>
            </Field.Header>
            <TextField.Root>
              <TextField.PrefixText>만</TextField.PrefixText>
              <TextField.Input
                accessibility-label="나이"
                maxlength={3}
                placeholder="20"
                type="number"
              />
              <TextField.SuffixText>세</TextField.SuffixText>
            </TextField.Root>
          </Field.Root>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
