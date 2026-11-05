# @seed-design/lynx-react-text-field

Headless component built to implement [SEED Lynx Text Field Input](https://seed-design.io/lynx/components/text-field-input). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { TextField } from "@seed-design/lynx-react-text-field";

export function NameInput() {
  const [value, setValue] = useState("");

  return (
    <view>
      <text>Display name</text>
      <TextField.Root value={value} onValueChange={setValue}>
        <TextField.Input placeholder="Enter your name" accessibility-label="Display name" />
      </TextField.Root>
    </view>
  );
}
```
