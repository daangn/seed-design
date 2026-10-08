# @seed-design/lynx-react-use-press-tap

Headless hook built to implement [SEED Lynx usePressTap](https://seed-design.io/lynx/hooks/use-press-tap). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { usePressTap } from "@seed-design/lynx-react-use-press-tap";

export function TappableCard() {
  const [tapCount, setTapCount] = useState(0);
  const { pressed, ...handlers } = usePressTap({
    onTap: () => {
      "background only";
      setTapCount((count) => count + 1);
    },
  });

  return (
    <view {...handlers} accessibility-element accessibility-traits="button">
      <text>{pressed ? "Pressing..." : "Tap me"}</text>
      <text>Taps: {tapCount}</text>
    </view>
  );
}
```
