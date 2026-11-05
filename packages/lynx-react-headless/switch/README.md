# @seed-design/lynx-react-switch

Headless component built to implement [SEED Lynx Switch](https://seed-design.io/lynx/components/switch). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { Switch } from "@seed-design/lynx-react-switch";

export function NotificationSwitch() {
  const [checked, setChecked] = useState(false);

  return (
    <Switch.Root checked={checked} onCheckedChange={setChecked}>
      <Switch.Control>
        <Switch.Thumb>
          <text>{checked ? "On" : "Off"}</text>
        </Switch.Thumb>
      </Switch.Control>
      <text>Enable notifications</text>
    </Switch.Root>
  );
}
```
