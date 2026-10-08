# @seed-design/lynx-react-toggle

Headless component built to implement [SEED Lynx Reaction Button](https://seed-design.io/lynx/components/reaction-button). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { Toggle } from "@seed-design/lynx-react-toggle";

export function LikeButton() {
  const [pressed, setPressed] = useState(false);

  return (
    <Toggle.Root pressed={pressed} onPressedChange={setPressed} accessibility-label="Like">
      <text>{pressed ? "Liked" : "Like"}</text>
    </Toggle.Root>
  );
}
```
