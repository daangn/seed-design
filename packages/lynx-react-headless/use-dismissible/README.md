# @seed-design/lynx-react-use-dismissible

Headless hook built to implement [SEED Lynx useDismissible](https://seed-design.io/lynx/hooks/use-dismissible). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useDismissible } from "@seed-design/lynx-react-use-dismissible";

export function Notice() {
  const { open, dismiss } = useDismissible();

  if (!open) return null;

  return (
    <view>
      <text>Your changes have been saved.</text>
      <view
        bindtap={dismiss}
        accessibility-element={true}
        accessibility-traits="button"
        accessibility-label="Dismiss notice"
      >
        <text>Dismiss</text>
      </view>
    </view>
  );
}
```
