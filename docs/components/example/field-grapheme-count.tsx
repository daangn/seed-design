import { TextField, useTextFieldWithGraphemes, Field, HStack } from "@seed-design/react";
import { ActionButton } from "@/registry/ui/action-button";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";

const isErrored = true;

export default function FieldGraphemeCount() {
  const field = useTextFieldWithGraphemes({
    maxGraphemeCount: 5,
    defaultValue: "foobar",
  });

  return (
    <div>
      <Field.Root>
        <Field.Header>
          <Field.Label>5글자 제한 텍스트 필드</Field.Label>
          <Field.Indicator>필수</Field.Indicator>
          <ActionButton bleedX="asPadding" bleedY="asPadding" variant="ghost" size="xsmall">
            foobar
          </ActionButton>
        </Field.Header>
        <HStack gap="x2">
          <TextField.Root {...field.textFieldRootProps}>
            <TextField.Input placeholder="12345" />
          </TextField.Root>
          <ActionButton
            variant="neutralWeak"
            onClick={() => field.textFieldRootProps.onValueChange("")}
          >
            Reset
          </ActionButton>
        </HStack>
        <Field.Footer>
          {isErrored ? (
            <Field.ErrorMessage>
              <Field.ErrorIcon svg={<IconExclamationmarkCircleFill />} />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Field.ErrorMessage>
          ) : (
            <Field.Description>
              Ipsum sit irure culpa fugiat fugiat qui ex tempor anim.
            </Field.Description>
          )}
          {field.counterProps && <Field.CharacterCount {...field.counterProps} />}
        </Field.Footer>
      </Field.Root>
      {field.textFieldRootProps.value}
    </div>
  );
}
