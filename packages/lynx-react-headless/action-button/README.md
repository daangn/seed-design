# @seed-design/lynx-react-action-button

Headless component built to implement [SEED Lynx Action Button](https://seed-design.io/lynx/components/action-button). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { ActionButton } from "@seed-design/lynx-react-action-button";

export function SaveButton() {
  const [saved, setSaved] = useState(false);

  return (
    <ActionButton.Root disabled={saved} bindtap={() => setSaved(true)}>
      <text>{saved ? "Saved" : "Save"}</text>
    </ActionButton.Root>
  );
}
```
