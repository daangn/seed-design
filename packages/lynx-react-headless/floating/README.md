# @seed-design/lynx-react-floating

Headless utility built to implement [SEED Lynx Menu](https://seed-design.io/lynx/components/menu). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useEffect, useState } from "@lynx-js/react";
import {
  computePosition,
  type ComputePositionOptions,
  type Position,
} from "@seed-design/lynx-react-floating";

export function FloatingMenu({
  reference,
  boundary,
  width,
  height,
}: Pick<ComputePositionOptions, "reference" | "boundary" | "width" | "height">) {
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    let active = true;
    void computePosition({
      reference,
      boundary,
      width,
      height,
      placement: "bottom-start",
      gutter: 4,
      overflowPadding: 8,
    }).then((next) => {
      if (active) setPosition(next);
    });
    return () => {
      active = false;
    };
  }, [reference, boundary, width, height]);

  if (!position) return null;
  return (
    <view
      style={{
        position: "fixed",
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
      }}
    >
      <text>Menu actions</text>
    </view>
  );
}
```
