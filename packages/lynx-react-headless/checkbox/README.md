# @seed-design/lynx-react-checkbox

Headless component built to implement [SEED Lynx Checkbox](https://seed-design.io/lynx/components/checkbox). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { Checkbox, useCheckboxContext } from "@seed-design/lynx-react-checkbox";

function CheckboxIndicator() {
  const { checked, indeterminate } = useCheckboxContext();

  return <text>{indeterminate ? "-" : checked ? "✓" : ""}</text>;
}

export function TermsCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox.Root checked={checked} onCheckedChange={setChecked}>
      <Checkbox.Control>
        <CheckboxIndicator />
      </Checkbox.Control>
      <text>I agree to the terms</text>
    </Checkbox.Root>
  );
}
```
