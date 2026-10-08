# @seed-design/lynx-react-field

Headless component built to implement [SEED Lynx Text Field Input](https://seed-design.io/lynx/components/text-field-input). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { Field, useFieldContext } from "@seed-design/lynx-react-field";

function NameInput() {
  const { disabled, readOnly, setFocused } = useFieldContext();

  return (
    <input
      accessibility-label="Name"
      placeholder="Enter your name"
      disabled={disabled}
      readonly={readOnly}
      bindfocus={() => setFocused(true)}
      bindblur={() => setFocused(false)}
    />
  );
}

export function NameField() {
  return (
    <Field.Root>
      <Field.Label>Name</Field.Label>
      <NameInput />
      <Field.Description>Use the name shown on your profile.</Field.Description>
    </Field.Root>
  );
}
```
