import "./styles";

import { root } from "@lynx-js/react";
import { Field, TextField, VStack, useSeedClassName } from "@seed-design/lynx-react";

function StateField({
  defaultValue,
  label,
  ...stateProps
}: Field.RootProps & { defaultValue?: string; label: string }) {
  return (
    <Field.Root {...stateProps}>
      <Field.Header>
        <Field.Label>{label}</Field.Label>
      </Field.Header>
      <TextField.Root defaultValue={defaultValue}>
        <TextField.Input accessibility-label={label} maxlength={100} placeholder="내용 입력" />
      </TextField.Root>
      {stateProps.invalid ? (
        <Field.Footer>
          <Field.ErrorMessage>입력 내용을 확인해 주세요.</Field.ErrorMessage>
        </Field.Footer>
      ) : null}
    </Field.Root>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="text-field-input-preview" gap="x4">
        <VStack className="text-field-input-preview__content" gap="spacingY.componentDefault">
          <StateField label="Enabled" />
          <StateField disabled label="Disabled" />
          <StateField defaultValue="수정할 수 없는 값" label="Read only" readOnly />
          <StateField invalid label="Invalid" />
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
